<template>
  <BaseView :isBlank="false">
    <template slot="view-title">
      <span>{{ $t("sidebar.search") }}</span>
    </template>

    <template slot="view">
      <div class="tool-bar">
        <!-- DEV 复用组件 -->
        <input type="text" class="search-box" v-model="keyword" @input="handleSearch()" />
        <div class="controls">
          <i class="ri-a-b" title="大小写" />
          <i class="ri-bar-chart-horizontal-line" title="全字匹配" />
          <i class="ri-registered-line" title="正则" />
        </div>
        <input type="text" class="include" />
        <input type="text" class="exclude" />
      </div>
      <ul class="search-result">
        <ListNode
          v-for="(item, idx) in searchResult"
          :key="idx"
          :nodeName="trailPath(item.filePath)"
        >
          <li
            v-for="(v, i) in item.matches"
            :key="i"
            @click="handleReveal(item.filePath, v.range)"
          >
            {{ v.lineText }}
          </li>
        </ListNode>
      </ul>
    </template>
  </BaseView>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import { joinPath } from "@/common/fileSystem";
import RipgrepDirectorySearcher from "@/library/ripgrepSearcher";
import { IRipgrepSearchResult } from "@/library/ripgrepSearcher.d";
import CheckList from "@/renderer/components/CheckList.vue";
import ListNode from "@/renderer/containers/SideBar/widgets/ListNode.vue";
import BaseView from "@/renderer/containers/SideBar/widgets/BaseView.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { ipcRenderer } from "electron";
import { IPC_FILE } from "@/common/channel/ipc";
import { BUS_EDITOR } from "@/common/channel/bus";

const sideBar = namespace("sideBar");
const general = namespace("general");
@Component({
  name: "Search",
  components: {
    BaseView,
    CheckList,
    ListNode,
  },
})
export default class Search extends Vue {
  @general.State((state: IGeneralState) => state.fileManager.folderDir)
  folderDir!: string;

  @sideBar.Getter("isEmptyFolder")
  isEmptyFolder!: boolean;

  // DEV 配置
  isCaseSensitive = false;

  isWholeWord = false;

  isRegexp = false;

  searchExclusions: Array<string> = [];

  searchInclusions: Array<string> = [];

  ripgrepDirectorySearcher = new RipgrepDirectorySearcher(joinPath(__static, "bin/rg"));

  keyword = "";

  searchResult: any = [];

  searcherRunning = false;

  // DEV
  searchErrorString = "";

  searcherCancelCallback!: any;

  trailPath(path: string) {
    const dirs = path.split("/");
    return dirs[dirs.length - 1];
  }

  handleSearch() {
    if (this.isEmptyFolder) {
      return;
    }

    if (this.searcherRunning && this.searcherCancelCallback) {
      this.searcherCancelCallback();
    }

    this.searchErrorString = "";
    this.searcherCancelCallback = null;

    if (!this.keyword) {
      this.searchResult = [];
      this.searcherRunning = false;
      return;
    }

    let canceled = false;
    this.searcherRunning = true;

    const newSearchResult: any = [];

    const promises = this.ripgrepDirectorySearcher
      .search([this.folderDir], this.keyword, {
        didMatch: (searchResult: IRipgrepSearchResult) => {
          if (canceled) return;
          newSearchResult.push(searchResult);
        },
        didSearchPaths: (numPathsFound: number) => {
          // More than 100 files with (multiple) matches were found.
          if (!canceled && numPathsFound > 100) {
            canceled = true;
            if (promises.cancel) {
              promises.cancel();
            }
            this.searchErrorString = "Search was limited to 100 files.";
          }
        },

        isCaseSensitive: this.isCaseSensitive,
        isWholeWord: this.isWholeWord,
        isRegexp: this.isRegexp,
        exclusions: this.searchExclusions,
        inclusions: this.searchInclusions,

        // DEV 参数选项
        /**
         * noIgnore: this.searchNoIgnore,
         * includeHidden: this.searchIncludeHidden,
         * followSymlinks: this.searchFollowSymlinks,
         */
      })
      .then(() => {
        this.searchResult = newSearchResult;
        this.searcherRunning = false;
        this.searcherCancelCallback = null;
      })
      .catch((err) => {
        canceled = true;
        if (promises.cancel) {
          promises.cancel();
        }
        this.searcherRunning = false;
        this.searcherCancelCallback = null;
        this.searchErrorString = err.message;
      });

    this.searcherCancelCallback = () => {
      canceled = true;
      this.searchResult = [];
      if (promises.cancel) {
        promises.cancel();
      }
    };
  }

  handleReveal(path: string, range: [[number, number], [number, number]]) {
    const route = path.slice(this.folderDir.length).split("/");
    ipcRenderer.emit(IPC_FILE.OPEN, null, route);
    console.log(range);
    // DEV 调整位置
    this.$bus.emit(BUS_EDITOR.REVEAL_SECTION, [range[0][0], range[0][0] + 1]);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

/deep/ .view {
  display: flex;
  flex-direction: column;
}

.tool-bar {
  display: flex;
  align-items: center;
  flex-direction: column;

  input[type="text"] {
    margin: 3px;
    height: 1.6em;
    font-size: 1.05em;
    color: var(--inputBox-Fg);
    background: #404552;
    font-family: @normal-font-family;
  }
}
</style>
