<template>
  <div>
    <top-bar class="layout-header" />
    <main class="layout-main">
      <aside class="left-side-bar">
        <side-bar :sideWidth="finalLeftWidth - 1.5" />
        <span v-show="isShowSide" ref="leftResize" />
      </aside>
      <work-bench class="center-container" :style="{ width: centerWidth }" />
    </main>
    <status-bar class="layout-footer" />
    <panel :fixed="false" />
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, shell } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Mutation, namespace } from "vuex-class";

import Panel from "@/component/Panel/Index.vue";
import TopBar from "@/view/TopBar/Index.vue";
import SideBar from "@/view/SideBar/Index.vue";
import StatusBar from "@/view/StatusBar/Index.vue";
import WorkBench from "@/view/WorkBench/Index.vue";
import { IBootCache } from "@/interface/bootstrap";
import { IGeneralState } from "@/interface/vuex/general";
import { debounce } from "@/common/editor/utils";
import { BUS_UI } from "@/common/bus-channel";
import { IPC_PREFERENCE } from "@/common/ipc-channel";

const general = namespace("general");
const sideBar = namespace("sideBar");

@Component({
  name: "App",
  components: {
    Panel,
    TopBar,
    SideBar,
    StatusBar,
    WorkBench,
  },
})
export default class App extends Vue {
  @Action("CHECK_UPDATE")
  CHECK_UPDATE!: () => void;

  @general.State((state: IGeneralState) => state.appearance.showSideBar)
  isShowSide!: boolean;

  @general.State((state: IGeneralState) => state.appearance.showPanel)
  isShowPanel!: boolean;

  @sideBar.Action("LOAD_TREE")
  LOAD_TREE!: () => void;

  leftViewWidth = 200;

  get finalLeftWidth() {
    return this.leftViewWidth;
  }

  set finalLeftWidth(value: number) {
    this.leftViewWidth = value;
  }

  get centerWidth() {
    return this.isShowSide
      ? `calc(100vw - 45px - ${this.finalLeftWidth}px`
      : "calc(100vw - 45px)";
  }

  handleResize = () => this.$bus.$emit(BUS_UI.SYNC_RESIZE);

  mounted() {
    // this.CHECK_UPDATE();
    this.LOAD_TREE();

    this.$nextTick(() => {
      const { leftResize, rightResize } = this.$refs;

      let leftSideBarWidth = +this.leftViewWidth;

      this.leftViewWidth = leftSideBarWidth;

      let startX = 0;
      let startWidth = leftSideBarWidth;

      const mouseMoveHandler = (e: MouseEvent) => {
        const offset = e.clientX - startX;
        leftSideBarWidth = startWidth + offset;
        if (leftSideBarWidth < 150) {
          this.leftViewWidth = 150;
        } else if (leftSideBarWidth > 250) {
          this.leftViewWidth = 250;
        } else {
          this.leftViewWidth = leftSideBarWidth;
        }
      };

      const mouseUpHandler = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandler, false);
        document.removeEventListener("mouseup", mouseUpHandler, false);
        // DEV @layout-leftSide-right-column;
        if (leftSideBarWidth >= 150 && leftSideBarWidth <= 250) {
          this.leftViewWidth = leftSideBarWidth;
        }
      };

      const mouseDownHandler = (e: MouseEvent) => {
        startX = e.clientX;
        startWidth = +this.leftViewWidth;
        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("mouseup", mouseUpHandler, false);
      };

      (leftResize as HTMLElement).addEventListener("mousedown", mouseDownHandler, false);

      /* 调整大小 */
      window.addEventListener("resize", this.handleResize);
    });
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

/* 以下为布局 */

.layout-header,
.layout-main,
.layout-footer {
  background: #efefef;
  width: 100vw;
}

.layout-main {
  height: calc(100vh - @layout-top-bar - @layout-bottom-bar);
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
}

.layout-footer {
  height: @layout-bottom-bar;
}

/* 以下为分区 */

.left-side-bar,
.center-container {
  height: calc(100vh - @layout-top-bar - @layout-bottom-bar);
}

.left-side-bar {
  left: 0;
  width: auto;
  display: flex;
}

/* 以下为 resize */

.layout-main {
  span {
    width: 1.5px;
    height: 100%;
    cursor: col-resize;
  }

  .left-side-bar span:hover {
    border-right: @resize-bar;
  }
}
</style>
