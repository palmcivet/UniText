<template>
  <div>
    <TitleBar class="layout-header" />
    <main class="layout-main">
      <aside class="left-side-bar">
        <SideBar :sideWidth="finalLeftWidth - 1.5" />
        <span v-show="isShowSide" ref="leftResize" />
      </aside>
      <WorkBench class="center-container" :style="{ width: centerWidth }" />
    </main>
    <StatusBar class="layout-footer" />
    <Panel :fixed="false" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ipcRenderer, IpcRendererEvent, shell } from "electron";
import { State, Action, Mutation, namespace } from "vuex-class";

import SideBar from "@/containers/SideBar/Index.vue";
import TitleBar from "@/containers/TitleBar/Index.vue";
import StatusBar from "@/containers/StatusBar/Index.vue";
import WorkBench from "@/containers/WorkBench/Index.vue";
import Panel from "@/containers/WorkBench/Panel/Index.vue";
import { IGeneralState } from "@/typings/modules/general";
import { debounce } from "@/common/utils";
import { BUS_UI } from "@/common/channel";

const general = namespace("general");

@Component({
  name: "Main",
  components: {
    Panel,
    SideBar,
    TitleBar,
    StatusBar,
    WorkBench,
  },
})
export default class Main extends Vue {
  @general.State((state: IGeneralState) => state.appearance.showSideBar)
  isShowSide!: boolean;

  @general.State((state: IGeneralState) => state.appearance.showPanel)
  isShowPanel!: boolean;

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
@import "~@/styles/var.less";

/* 以下为布局 */

.layout-header,
.layout-main,
.layout-footer {
  background: #efefef;
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
    #res();
  }
}
</style>
