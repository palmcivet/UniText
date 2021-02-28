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
      <ul class="search-result"></ul>
    </template>
  </BaseView>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import { joinPath } from "@/common/fileSystem";
import RipgrepDirectorySearcher from "@/library/ripgrepSearcher";
import CheckList from "@/renderer/components/CheckList.vue";
import BaseView from "@/renderer/containers/SideBar/widgets/BaseView.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { IRipgrepSearchResult } from "@/typings/ripgrepSearcher";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "Search",
  components: {
    BaseView,
    CheckList,
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
      if (promises.cancel) {
        promises.cancel();
      }
    };
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
    background: #7d89a3;
    font-family: @normal-font-family;
  }
}
</style>
