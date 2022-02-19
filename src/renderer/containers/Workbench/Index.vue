<template>
  <div class="workbench">
    <Startup v-show="showStartup" />

    <div v-show="!showStartup" class="workbench-controls"></div>

    <div v-show="!showStartup" class="workbench-pane">
      <TabBar class="pane-tabs" />

      <div class="pane-type">
        <Editor v-show="isEditor" />

        <keep-alive v-if="!isEditor">
          <component :is="workbenchType" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { storeToRefs } from "pinia";

import useWorkbench from "@/renderer/stores/workbench";
import TabBar from "./TabBar.vue";

// TODO 需要优化成可卸载的结构

export default defineComponent({
  name: "Workbench",

  components: {
    Dashboard: defineAsyncComponent(() => import("./Dashboard/Index.vue")),
    Graphview: defineAsyncComponent(() => import("./Graphview/Index.pre.vue")),
    Schedule: defineAsyncComponent(() => import("./Schedule/Index.pre.vue")),
    Setting: defineAsyncComponent(() => import("./Setting/Index.vue")),
    Editor: defineAsyncComponent(() => import("./Document/Index.vue")),
    Startup: defineAsyncComponent(() => import("./Startup/Index.vue")),
    TabBar,
  },

  setup() {
    const workbench = useWorkbench();
    const { workbenchType, showStartup, isEditor } = storeToRefs(workbench);

    return {
      workbenchType,
      showStartup,
      isEditor,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.workbench {
  width: 100%;
  height: 100%;
  color: var(--u-workbench-fg);
  background-color: var(--u-workbench-bg);

  &-controls {
    position: absolute;
    display: flex;
    align-items: center;
    right: 0;
    height: @tabBar-height + @tabBar-underline-width;
    z-index: 9;
  }

  &-pane {
    height: 100%;

    .pane-tabs {
      height: @tabBar-height + @tabBar-underline-width;
    }

    .pane-type {
      height: calc(100% - @tabBar-height - @tabBar-underline-width);
    }
  }
}
</style>
