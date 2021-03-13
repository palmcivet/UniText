<template>
  <header>
    <span>UniText</span>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "TitleBar",
})
export default class TitleBar extends Vue {
  // win.maximize();
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

header {
  height: @layout-titleBar-height;
  user-select: none;
  -webkit-app-region: drag;
  background: var(--titleBar-activeBg);

  span {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: @titleBar-font-size;
    color: var(--titleBar-activeFg);
  }
}
</style>
