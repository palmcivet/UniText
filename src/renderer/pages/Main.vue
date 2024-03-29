<template>
  <div class="layout-main">
    <TitleBar class="layout-titlebar" />

    <main :style="{ height: isWin ? 'calc(100vh - 24px)' : '' }">
      <ActivityBar class="layout-activitybar" />

      <SplitView
        :showLeft="isShowBrowser"
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
          <div class="layout-workbench">
            <Workbench />
          </div>
        </template>
      </SplitView>
    </main>

    <StatusBar class="layout-statusbar" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";

import TitleBar from "@/renderer/containers/TitleBar/Index.vue";
import Browser from "@/renderer/containers/Browser/Index.vue";
import StatusBar from "@/renderer/containers/StatusBar/Index.vue";
import Workbench from "@/renderer/containers/Workbench/Index.vue";
import ActivityBar from "@/renderer/containers/ActivityBar/Index.vue";
import SplitView from "@/renderer/components/SplitView/Index.vue";
import useBrowser from "@/renderer/stores/browser";
import useEnvironment from "@/renderer/stores/environment";

export default defineComponent({
  name: "Main",

  components: {
    TitleBar,
    StatusBar,
    ActivityBar,
    Browser,
    Workbench,
    SplitView,
  },

  setup() {
    const { isWin } = storeToRefs(useEnvironment());
    const { isShowBrowser } = storeToRefs(useBrowser());

    return {
      isWin,
      isShowBrowser,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.layout-main {
  .layout-titlebar {
    height: @layout-titleBar-height;
  }

  .layout-statusbar {
    height: @layout-statusBar-height;
  }

  main {
    display: flex;
    height: calc(100vh - @layout-titleBar-height - @layout-statusBar-height);

    .layout-activitybar {
      height: 100%;
      width: @layout-activityBar-width;
    }

    .splitview {
      width: calc(100vw - @layout-activityBar-width);
    }

    .layout-browser {
      height: 100%;
    }

    .layout-workbench {
      height: 100%;
    }
  }
}
</style>
