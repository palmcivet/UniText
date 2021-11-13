<template>
  <li
    class="tab-bar-item"
    @click.stop="$emit('select-tab')"
    @contextmenu="$emit('context-tab')"
  >
    <span>{{ tab.title }}</span>
    <i
      :class="
        isHover
          ? 'ri-close-circle-line'
          : tab.title
          ? 'ri-checkbox-blank-circle-line'
          : 'ri-close-line'
      "
      @click.stop="$emit('close-tab')"
      @mouseenter="isHover = true"
      @mouseout="isHover = false"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { ITab } from "@/shared/typings/model";

export default defineComponent({
  name: "TabBarItem",

  emits: ["select-tab", "context-tab", "close-tab"],

  props: {
    tab: { type: Object as PropType<ITab> },
  },

  setup() {
    return {
      isHover: ref(false),
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.tab-bar-item {
  cursor: pointer;
  padding: 0 1.8em 0 0.8em;
  position: relative;

  color: var(--tabBarTab-Fg);
  background: var(--tabBarTab-Bg);
  height: @tabBar-height;
  border-right: 1px solid var(--tabBarRightBorder-Color);

  &.active {
    border-bottom: @tabBar-underline-width solid var(--tabBarUnderline-Color);
  }

  &.inactive {
    opacity: 0.5;
  }

  &:hover {
    opacity: 0.9;
    color: var(--tabBarTab-hoverFg);
    background: var(--tabBarTab-hoverBg);
  }

  &.ghost {
    opacity: 0.5;
    color: var(--tabBarTab-Fg);
    background: var(--tabBar-inactiveBg);
  }

  span {
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    user-select: none;
  }

  i {
    line-height: 12px;
    font-size: 12px;
    border-radius: 50%;
    position: absolute;
    right: 0.5em;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      opacity: 1;
      background: var(--tabBarTab-hoverBg);
    }
  }
}
</style>
