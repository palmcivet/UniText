<template>
  <header>
    <span>UniText</span>
  </header>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "TopBar",
})
export default class TopBar extends Vue {}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

header {
  height: @layout-top-bar;
  -webkit-user-select: none;
  -webkit-app-region: drag;

  span {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    font-size: 13px;
  }
}
</style>
