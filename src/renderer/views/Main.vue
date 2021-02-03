<template>
  <div>
    <TitleBar class="layout-header" />
    <main class="layout-main">
      <aside class="left-side-bar">
        <ActivityBar :sideWidth="finalLeftWidth - 1.5" />
        <span v-show="isShowSide" ref="leftResize" />
      </aside>
      <WorkBench class="center-container" :style="{ width: centerWidth }" />
    </main>
    <StatusBar class="layout-footer" />
    <!-- TODO 放进 WorkBench -->
    <SidePanel :fixed="false" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ipcRenderer } from "electron";

import { notEmpty } from "@/common/utils";
import { BUS_UI } from "@/common/channel/bus";
import { IPC_BOOTSTRAP, IPC_PREFERENCE } from "@/common/channel/ipc";
import TitleBar from "@/renderer/containers/TitleBar/Index.vue";
import SidePanel from "@/renderer/containers/SidePanel/Index.vue";
import StatusBar from "@/renderer/containers/StatusBar/Index.vue";
import WorkBench from "@/renderer/containers/WorkBench/Index.vue";
import ActivityBar from "@/renderer/containers/ActivityBar/Index.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { IBootArgs } from "@/typings/bootstrap";
import { EI18n, IPreferenceSystem } from "@/typings/service/preference";

const general = namespace("general");

@Component({
  name: "Main",
  components: {
    TitleBar,
    SidePanel,
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
@import "~@/renderer/styles/var.less";

/* 以下为布局 */

.layout-header,
.layout-main,
.layout-footer {
  background: #efefef;
  font-family: "PingFang SC";
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
    #resize-style();
  }
}
</style>
