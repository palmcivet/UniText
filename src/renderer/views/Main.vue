<template>
  <div class="main-window">
    <TitleBar v-show="showTitle" />
    <main>
      <ActivityBar />
      <SideBar :style="{ width: `${finalLeftWidth}px` }" />
      <span class="unitext-resize" v-show="isShowSide" ref="leftResize" />
      <WorkBench :style="{ width: centerWidth }" />
    </main>
    <StatusBar />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ipcRenderer } from "electron";

import { isOsx } from "@/common/env";
import { notEmpty } from "@/common/utils";
import { BUS_UI } from "@/common/channel/bus";
import { IPC_BOOTSTRAP, IPC_PREFERENCE } from "@/common/channel/ipc";
import SideBar from "@/renderer/containers/SideBar/Index.vue";
import TitleBar from "@/renderer/containers/TitleBar/Index.vue";
import StatusBar from "@/renderer/containers/StatusBar/Index.vue";
import WorkBench from "@/renderer/containers/WorkBench/Index.vue";
import ActivityBar from "@/renderer/containers/ActivityBar/Index.vue";
import { IBootArgs } from "@/typings/bootstrap";
import { IGeneralState } from "@/typings/vuex/general";
import { EI18n, IPreferenceSystem } from "@/typings/service/preference";

const general = namespace("general");

@Component({
  name: "Main",
  components: {
    SideBar,
    TitleBar,
    StatusBar,
    WorkBench,
    ActivityBar,
  },
})
export default class Main extends Vue {
  @general.State((state: IGeneralState) => state.userInterface.showSideBar)
  isShowSide!: boolean;

  @general.State((state: IGeneralState) => state.userInterface.showPanel)
  isShowPanel!: boolean;

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

  created() {
    const { commit, dispatch } = this.$store;

    ipcRenderer.once(
      IPC_BOOTSTRAP.REPLY,
      (event, msg: { sys: IPreferenceSystem; args: IBootArgs }) => {
        const { sys, args } = msg;
        this.$i18n.setLang(EI18n[sys.language]);

        if (notEmpty(args.error)) {
          commit("information/SET_ERROR", args.error, { root: true });
        }
      }
    );
    ipcRenderer.send(IPC_BOOTSTRAP.FETCH);

    commit("SET_STATE", {
      ...ipcRenderer.sendSync(
        IPC_PREFERENCE.GET_ITEM_SYNC,
        "system",
        "userInterface",
        "fileManager",
        "editor",
        "document",
        "markdown"
      ),
    });

    dispatch("SET_THEME");
    dispatch("information/CHECK_UPDATE");
    dispatch("general/LISTEN_FOR_GENERAL");
    dispatch("workBench/LISTEN_FOR_FILE");
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
@import "~@/renderer/styles/var.less";

.main-window {
  > main {
    display: flex;
    height: calc(100vh - @layout-titleBar-height - @layout-statusBar-height);
  }
}
</style>
