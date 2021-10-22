<template>
  <header @dblclick="toggleZoom()">
    <span class="window-title">UniText</span>
    <div class="window-controls" v-if="isWin">
      <i class="ri-indeterminate-circle-line" />
      <i class="ri-fullscreen-line" />
      <i class="ri-close-line" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import useEnvironment from "@/renderer/store/environment";

export default defineComponent({
  name: "TitleBar",

  setup() {
    const toggleZoom = () => {
      // win.maximize();
    };

    return {
      toggleZoom,
      isWin: useEnvironment().isWin,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

header {
  user-select: none;
  text-align: center;
  -webkit-app-region: drag;

  .window-title {
    color: var(--titleBar-activeFg);
    font-size: @titleBar-font-size;
    line-height: @layout-titlebar-height - 1;
  }

  .window-controls {
    text-align: right;
    position: absolute;
    height: @layout-titlebar-height;
    width: 100px;
    right: 0;
    top: 0;

    i {
      color: var(--titleBar-activeFg);
      line-height: @layout-titlebar-height;
    }
  }
}
</style>
