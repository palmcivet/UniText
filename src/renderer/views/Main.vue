<template>
  <div class="main-window" v-if="hasFetched">
    <TitleBar v-show="showTitle" />
    <main>
      <ActivityBar />
      <SideBar :style="{ width: `${finalLeftWidth - 2}px` }" />
      <span class="unitext-resize" v-show="isShowSide" ref="leftResize" />
      <WorkBench :style="{ width: centerWidth }" />
    </main>
    <StatusBar />
    <MessagePanel v-show="showMessage" class="float" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { isOsx } from "@/common/env";
import { BUS_UI } from "@/common/channel/bus";
import SideBar from "@/renderer/containers/SideBar/Index.vue";
import TitleBar from "@/renderer/containers/TitleBar/Index.vue";
import StatusBar from "@/renderer/containers/StatusBar/Index.vue";
import WorkBench from "@/renderer/containers/WorkBench/Index.vue";
import ActivityBar from "@/renderer/containers/ActivityBar/Index.vue";
import MessagePanel from "@/renderer/containers/StatusBar/widgets/MessagePanel.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { INotificationState } from "@/typings/vuex/notification";

const general = namespace("general");
const notification = namespace("notification");

@Component({
  name: "Main",
  components: {
    SideBar,
    TitleBar,
    StatusBar,
    WorkBench,
    ActivityBar,
    MessagePanel,
  },
})
export default class Main extends Vue {
  @general.State((state: IGeneralState) => state.interface.showSideBar)
  isShowSide!: boolean;

  @general.State((state: IGeneralState) => state.interface.showPanel)
  isShowPanel!: boolean;

  @notification.State((state: INotificationState) => state.hasFetched)
  hasFetched!: boolean;

  @notification.State((state: INotificationState) => state.showMessage)
  showMessage!: boolean;

  leftViewWidth = 200;

  showTitle = isOsx;

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

  handleResize() {
    this.$bus.emit(BUS_UI.SYNC_RESIZE);
  }

  beforeCreate() {
    const { dispatch } = this.$store;
    dispatch("LOAD_STATE");
  }

  created() {
    const { dispatch } = this.$store;
    dispatch("general/LISTEN_FOR_GENERAL");
    dispatch("sideBar/LISTEN_FOR_SIDEBAR");
    dispatch("workBench/LISTEN_FOR_FILE");
    dispatch("statusPanel/LISTEN_FOR_STATUS");
    dispatch("notification/CHECK_UPDATE");

    this.$theme.loadTheme();
  }

  mounted() {
    this.$nextTick(() => {
      const { leftResize } = this.$refs;

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
        // DEV @layout-leftSide-left-width;
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

      // TODO 修复
      setTimeout(
        () =>
          (leftResize as HTMLElement).addEventListener(
            "mousedown",
            mouseDownHandler,
            false
          ),
        300
      );

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
@import "~@/renderer/styles/var.less";

.main-window {
  > main {
    display: flex;
    height: calc(100vh - @layout-titleBar-height - @layout-statusBar-height);
  }

  .float {
    position: absolute;
    z-index: 999;
    bottom: calc(@layout-statusBar-height + 8px);
    right: 10px; // DEV 来自 sidepanel
    box-shadow: -3px -2px 10px -5px black;
    min-width: 16em;
  }
}
</style>
