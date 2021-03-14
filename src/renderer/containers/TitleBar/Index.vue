<template>
  <header @dblclick="toogleZoom()">
    <span class="text">UniText</span>
    <div class="tool" v-if="isWin32">
      <i class="ri-indeterminate-circle-line" />
      <i class="ri-fullscreen-line" />
      <i class="ri-close-line" />
    </div>
  </header>
</template>

<script lang="ts">
import { isWin } from "@/common/env";
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "TitleBar",
})
export default class TitleBar extends Vue {
  isWin32 = isWin;

  toogleZoom() {
    // win.maximize();
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

header {
  height: @layout-titleBar-height;
  user-select: none;
  -webkit-app-region: drag;
  background: var(--titleBar-activeBg);

  .text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: @titleBar-font-size;
    color: var(--titleBar-activeFg);
  }
}
</style>
