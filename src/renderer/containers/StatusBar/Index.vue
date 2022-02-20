<template>
  <div class="status-bar">
    <!-- 左边只展示不交互 -->
    <ul class="status-bar-left">
      <component v-for="(status, index) in leftGroup" :is="status" :key="index" />
    </ul>
    <!-- 右边可交互 -->
    <ul class="status-bar-right">
      <Message />
      <component v-for="(status, index) in rightGroup" :is="status" :key="index" />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Message from "./Message/Index.vue";
import ModeGroup from "./ModeGroup.vue";
import StatusGroup from "./StatusGroup.vue";

export default defineComponent({
  name: "StatusBar",

  components: {
    StatusGroup,
    ModeGroup,
    Message,
  },

  data() {
    return {
      leftGroup: [StatusGroup.name],
      rightGroup: [ModeGroup.name],
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.status-bar {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 8px;
  color: var(--u-statusBar-fg);
  background-color: var(--u-statusBar-bg);

  &-left,
  &-right {
    display: flex;
    font-size: @statusBar-font-size;

    ::v-deep(ul) {
      display: flex;
      padding: 0 8px;
    }

    ::v-deep(li) {
      padding: 0 4px;
      cursor: pointer;
      user-select: none;
      line-height: @layout-statusBar-height;

      &:hover {
        color: var(--u-statusBar-hover-fg);
        background-color: var(--u-statusBar-hover-bg);
      }

      i {
        font-size: @icon-font-size-normal;
        line-height: @layout-statusBar-height;
      }
    }
  }

  &-right {
    flex-direction: row-reverse;
  }
}
</style>
