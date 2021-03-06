<template>
  <BaseView :isBlank="false">
    <template slot="view-title">
      <span>{{ $t("sidebar.search") }}</span>
    </template>

    <template slot="view">
      <div class="tool-bar">
        <!-- TODO 复用组件 -->
        <input
          type="text"
          class="search-box"
          v-model="keyword"
          @input="handleSearch()"
          placeholder="搜索"
        />
        <div class="controls">
          <div
            :class="isCaseSensitive ? 'active' : ''"
            @click="isCaseSensitive = !isCaseSensitive"
          >
            <i class="ri-a-b" title="大小写" />
          </div>
          <div :class="isWholeWord ? 'active' : ''" @click="isWholeWord = !isWholeWord">
            <i class="ri-bar-chart-horizontal-line" title="全字匹配" />
          </div>
          <div :class="isRegexp ? 'active' : ''" @click="isRegexp = !isRegexp">
            <i class="ri-registered-line" title="正则" />
          </div>
          <div :class="isInclude ? 'active' : ''" @click="isInclude = !isInclude">
            <i class="ri-add-circle-line" title="包含" />
          </div>
          <div :class="isExclude ? 'active' : ''" @click="isExclude = !isExclude">
            <i class="ri-subtract-line" title="排除" />
          </div>
        </div>
        <input
          type="text"
          class="include"
          placeholder="包含文件"
          v-if="isInclude"
          v-model="searchInclusions"
        />
        <input
          type="text"
          class="exclude"
          placeholder="排除文件"
          v-if="isExclude"
          v-model="searchExclusions"
        />
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

  isInclude = false;

  isExclude = false;

  isCaseSensitive = false;

  isWholeWord = false;

  isRegexp = false;

  searchExclusions: Array<string> = [];

  searchInclusions: Array<string> = [];

  ripgrepDirectorySearcher = new RipgrepDirectorySearcher(joinPath(__static, "bin/rg"));

  keyword = "";

  searchResult: any = [];

  searcherRunning = false;

  // TODO 提示
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
        inclusions: this.searchInclusions,
        exclusions: this.searchExclusions,

        // TODO 参数选项
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
    // TODO 调整位置
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
  padding: 2px;

  .controls {
    display: flex;
    width: 100%;
    justify-content: space-around;

    > div {
      width: 20px;
      height: 20px;
      cursor: pointer;
      text-align: center;

      i {
        line-height: 20px;
      }

      &:hover {
        color: #efefef; // DEV
      }

      &.active {
        color: var(--sideBarItem-hoverFg);
        background: #414958; // DEV
      }
    }
  }

  input[type="text"] {
    margin: 2px 0;
    height: 1.5em;
    font-size: 1.05em;
    color: var(--inputBox-Fg);
    background: #404552; // DEV
    font-family: @normal-font-family;
  }
}
</style>
