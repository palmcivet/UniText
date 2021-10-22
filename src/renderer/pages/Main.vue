<template>
  <div class="layout-main">
    <TitleBar class="layout-titlebar" />
    <main :style="{ height: isWin ? 'calc(100vh - 24px)' : '' }">
      <ActivityBar />
      <SplitView
        :showLeft="!isShowBrowser"
        :showRight="true"
        :isReverse="false"
        :initWidth="200"
        :threshold="[150, 300]"
      >
        <template #left>
          <div class="layout-browser">
            <Browser />
          </div>
        </template>
        <template #right>
          <div class="layout-workbench"></div>
        </template>
      </SplitView>
    </main>
    <StatusBar class="layout-statusbar" />
    <!-- <MessagePanel class="layout-float" v-show="showMessage" /> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import TitleBar from "@/renderer/containers/TitleBar/Index.vue";
import Browser from "@/renderer/containers/Browser/Index.vue";
import StatusBar from "@/renderer/containers/StatusBar/Index.vue";
// import WorkBench from "@/renderer/containers/WorkBench/Index.vue";
import ActivityBar from "@/renderer/containers/ActivityBar/Index.vue";
// import MessagePanel from "@/renderer/containers/StatusBar/widgets/MessagePanel.vue";
import SplitView from "@/renderer/components/SplitView/Index.vue";
import useGeneral from "@/renderer/store/general";
import useBrowser from "@/renderer/store/browser";
import useEnvironment from "@/renderer/store/environment";

export default defineComponent({
  name: "Main",

  components: {
    TitleBar,
    Browser,
    StatusBar,
    ActivityBar,
    SplitView,
  },

  setup() {
    const general = useGeneral();
    const environment = useEnvironment();
    const browser = useBrowser();

    return {
      isWin: environment.isWin,
      isShowBrowser: computed(() => browser.isShowBrowser),
    };
  },

  created() {},

  mounted() {},
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.layout-main {
  .layout-titlebar {
    height: @layout-titlebar-height;
    background: var(--titleBar-activeBg);
  }

  main {
    display: flex;
    height: calc(100vh - @layout-titlebar-height - @layout-statusbar-height);

    .layout-browser {
      height: 100%;
      color: var(--workBench-Fg);
      background: rgb(46, 46, 46); // DEV
    }

    .layout-workbench {
      height: 100%;
      color: var(--workBench-Fg);
      background: var(--workBench-Bg);
    }
  }
}
</style>
