<template>
  <div>
    <div class="title">
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

  .title {
    display: flex;
    height: @sidebar-header-height;
    z-index: 999;
    color: #474747;
    background-color: rgb(235, 238, 225);
    box-shadow: 0px 1px 5px rgba(222, 241, 185, 0.6);

    > span {
      margin-left: 1em;
      margin-right: 0.5em;
    }

    > i {
      line-height: @sidebar-header-height;
      cursor: pointer;
    }

    * {
      -webkit-user-select: none;
    }
  }

  .view {
    height: calc(100% - @sidebar-header-height);
    position: relative;

    ul {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
