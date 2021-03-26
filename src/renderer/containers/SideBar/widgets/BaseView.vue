<template>
  <div class="side-bar">
    <div class="header">
      <slot v-if="isBlank" name="blank-title" />
      <slot v-else name="view-title" />
    </div>

    <div class="view">
      <slot name="view" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "BaseView" })
export default class BaseView extends Vue {
  @Prop({ type: Boolean, default: false })
  isBlank!: boolean;
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.side-bar {
  background: var(--sideBar-Bg);
  color: var(--sideBar-Fg);
  height: 100%;

  .header {
    display: flex;
    padding: 0 0.8em;
    justify-content: space-between;
    height: @sideBar-header-height;
    line-height: @sideBar-header-height;
    color: var(--sideBarHeader-Fg);
    background: var(--sideBarHeader-Bg);

    i {
      line-height: @sideBar-header-height;
      cursor: pointer;
      padding: 0 2px;
    }

    * {
      user-select: none;
    }
  }

  .view {
    height: calc(100% - @sideBar-header-height);
    position: relative;

    ul {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
