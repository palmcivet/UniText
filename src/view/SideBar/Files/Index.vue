<template>
  <section>
    <header>
      <!-- 工具栏 -->
      <div v-if="folderDir === ''">无打开的文件/文件夹</div>
      <div v-else>
        <span>文件管理</span>
        <i class="ri-checkbox-indeterminate-line" @click="toggleAll()" title="收起" />
      </div>
    </header>

    <div v-if="folderDir === ''">
      <button @click="OPEN_FOLDER()">打开文件夹</button>
    </div>
    <div v-else @mouseenter="handleMouseEnter()" @mouseleave="handleMouseLeave()">
      <vue-custom-scrollbar
        tagname="ul"
        :settings="{
          swipeEasing: 'true',
          scrollingThreshold: '300',
        }"
      >
        <tree-item
          v-for="(data, name) in folderTree"
          :key="data.order"
          :itemName="name"
          :itemData="data"
          :isIndent="isIndent"
          :treeDeepth="1"
          @toggle="TOGGLE_FOLDER($event)"
        />
      </vue-custom-scrollbar>
    </div>
  </section>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, remote } from "electron";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import vueCustomScrollbar from "vue-custom-scrollbar";
import draggable from "vuedraggable";
import * as fse from "fs-extra";

import TreeItem from "@/view/SideBar/Files/TreeItem/Index.vue";
import { ITreeItem, ISideBarState } from "@/interface/vuex/sideBar";
import { BUS_FILE } from "@/common/bus-channel";

const workBench = namespace("workBench");
const general = namespace("general");
const sideBar = namespace("sideBar");

@Component({
  name: "File",
  components: {
    draggable,
    vueCustomScrollbar,
    TreeItem,
  },
})
export default class Files extends Vue {
  @workBench.Action("OPEN_FILE")
  OPEN_FILE!: (path: string) => void;

  @sideBar.State((state: ISideBarState) => state.files.folderDir)
  folderDir!: string;

  @sideBar.State((state: ISideBarState) => state.files.showIndent)
  showIndent!: boolean;

  @sideBar.State((state: ISideBarState) => state.files.defaultFold)
  defaultFold!: boolean;

  @sideBar.State((state: ISideBarState) => state.folderTree)
  folderTree!: ITreeItem;

  @sideBar.Mutation("TOGGLE_FOLDER")
  TOGGLE_FOLDER!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_ALL")
  TOGGLE_ALL!: (isOnce: boolean) => void;

  @sideBar.Action("OPEN_FOLDER")
  OPEN_FOLDER!: () => void;

  @sideBar.Action("BUILD_TREE")
  BUILD_TREE!: () => void;

  isIndent = false;

  isOnce = true;

  toggleAll() {
    this.TOGGLE_ALL(this.isOnce);
    this.isOnce = !this.isOnce;
  }

  handleMouseEnter() {
    this.showIndent && (this.isIndent = true);
  }

  handleMouseLeave() {
    this.showIndent && (this.isIndent = false);
  }

  mounted() {
    this.$bus.$on(BUS_FILE.OPEN_FILE, (value: string) => {
      this.OPEN_FILE(`${this.folderDir}/${value}`);
    });
  }

  beforeDestroy() {
    this.$bus.$off(BUS_FILE.OPEN_FILE);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/widget.less";

section {
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    color: #252525;
    background-color: rgb(251, 255, 227);
    box-shadow: 0px 1px 5px rgba(222, 241, 185, 0.6);

    > div {
      display: flex;

      > span,
      > i {
        line-height: 24px;
        margin-left: 3px;
      }
    }

    * {
      -webkit-user-select: none;
    }
  }

  > div {
    height: calc(100% - 25px);
    position: relative;

    > button {
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 0.5em;
      transform: translate(-50%, 50%);
      color: whitesmoke;
      background-color: #55aaf3;
      box-shadow: 3px 3px 6px rgba(123, 194, 245, 0.6);
      border-radius: 2px;
      outline-style: none;
      -webkit-user-select: none;
    }

    > ul {
      height: 100%;
    }
  }
}
</style>
