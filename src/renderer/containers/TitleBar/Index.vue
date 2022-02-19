<template>
  <div class="title-bar" @dblclick="onToggleZoom()">
    <span class="window-title">UniText</span>
    <div class="window-controls" v-if="isWin">
      <i class="ri-indeterminate-circle-line" />
      <i class="ri-fullscreen-line" />
      <i class="ri-close-line" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";

import useEnvironment from "@/renderer/stores/environment";

export default defineComponent({
  name: "TitleBar",

  setup() {
    const { isWin } = storeToRefs(useEnvironment());
    const onToggleZoom = () => {
      // win.maximize();
    };

    return {
      isWin,
      onToggleZoom,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.title-bar {
  user-select: none;
  text-align: center;
  -webkit-app-region: drag;
  color: var(--u-titleBar-active-fg);
  background-color: var(--u-titleBar-active-bg);

  .window-title {
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
  }
}
</style>
