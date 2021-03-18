<template>
  <div class="main-window">
    <TitleBar />
    <main>
      <ActivityBar />
      <div>
        <div><SideBar /></div>
        <span class="unitext-resize" v-sash="'side'" />
        <div><WorkBench /></div>
      </div>
    </main>
    <StatusBar />
    <MessagePanel v-show="showMessage" class="float" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import LayoutView from "@/renderer/components/LayoutView.vue";
import SideBar from "@/renderer/containers/SideBar/Index.vue";
import TitleBar from "@/renderer/containers/TitleBar/Index.vue";
import StatusBar from "@/renderer/containers/StatusBar/Index.vue";
import WorkBench from "@/renderer/containers/WorkBench/Index.vue";
import ActivityBar from "@/renderer/containers/ActivityBar/Index.vue";
import MessagePanel from "@/renderer/containers/StatusBar/widgets/MessagePanel.vue";
import { INotificationState } from "@/typings/vuex/notification";

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
    LayoutView,
  },
})
export default class Main extends Vue {
  @notification.State((state: INotificationState) => state.showMessage)
  showMessage!: boolean;

  beforeCreate() {
    const { commit } = this.$store;

    commit("SET_STATE", this.$preference.getAll());
    this.$theme.loadTheme();
  }

  created() {
    const { dispatch } = this.$store;
    dispatch("general/LISTEN_FOR_GENERAL");
    dispatch("sideBar/LISTEN_FOR_SIDEBAR");
    dispatch("workBench/LISTEN_FOR_FILE");
    dispatch("statusPanel/LISTEN_FOR_STATUS");
    dispatch("notification/LISTEN_FOR_NOTIFY");
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.main-window {
  > main {
    display: flex;
    height: calc(100vh - @layout-titleBar-height - @layout-statusBar-height);

    > div {
      width: calc(100% - @layout-leftSide-left-width);
      height: 100%;
      display: flex;
    }
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
