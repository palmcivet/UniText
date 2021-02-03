<template>
  <div>
    <div class="header">
      <slot v-if="isBlank" name="blank-title" />
      <slot v-else name="view-title" />
    </div>

    <div class="view">
      <slot v-if="isBlank" name="blank" />
      <slot v-else name="view" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "Base" })
export default class Base extends Vue {
  @Prop({ type: Boolean, default: false })
  isBlank!: boolean;
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

div {
  height: 100%;

  .header {
    display: flex;
    height: @sideBar-header-height;
    line-height: @sideBar-header-height;
    color: var(--sideBarHeader-Fg);
    background: var(--sideBarHeader-Bg);

    > span {
      margin-left: 1em;
      margin-right: 0.5em;
    }

    > i {
      line-height: @sideBar-header-height;
      cursor: pointer;
    }

    * {
      user-select: none;
    }
  }

  .view {
    height: calc(100% - @sideBar-header-height);
    position: relative;

    ul {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
