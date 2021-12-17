<template>
  <li
    :class="['tab-bar-item', tab.isActivated ? 'active' : 'inactive']"
    @click.stop="$emit('select-tab')"
    @contextmenu="$emit('context-tab')"
    :title="tab.description"
  >
    <span class="tar-bar-item__text">{{ tab.title }}</span>
    <i
      :class="['tar-bar-item__icon', iconClass]"
      @click.stop="$emit('close-tab')"
      @mouseenter="isHover = true"
      @mouseout="isHover = false"
    />
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { ITab } from "@/shared/typings/model";

export default defineComponent({
  name: "TabBarItem",

  emits: ["select-tab", "context-tab", "close-tab"],

  props: {
    tab: { type: Object as PropType<ITab>, required: true },
  },

  setup(props) {
    const isHover = ref(false);
    const iconClass = computed(() => {
      return isHover.value
        ? "ri-close-circle-line"
        : props.tab.isModified
        ? "ri-checkbox-blank-circle-line"
        : "ri-close-line";
    });

    return {
      isHover,
      iconClass,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";
@import "~@/renderer/styles/mixins.less";

.tab-bar-item {
  cursor: pointer;
  padding: 0 1.8em 0 0.8em;
  position: relative;

  color: var(--tabBarTab-Fg);
  background: var(--tabBarTab-Bg);
  height: @tabBar-height;
  border-right: 1px solid var(--tabBarRightBorder-Color);

  &:hover {
    opacity: 0.9;
    color: var(--tabBarTab-hoverFg);
    background: var(--tabBarTab-hoverBg);
  }

  &.active {
    border-bottom: @tabBar-underline-width solid var(--tabBarUnderline-Color);
  }

  &.inactive {
    opacity: 0.5;
  }

  &.ghost {
    opacity: 0.5;
    color: var(--tabBarTab-Fg);
    background: var(--tabBar-inactiveBg);
  }

  .tar-bar-item__text {
    display: inline-block;
    user-select: none;
    max-width: 200px;
    .ellipsis();
  }

  .tar-bar-item__icon {
    line-height: 12px;
    font-size: 12px;
    border-radius: 50%;
    position: absolute;
    right: 0.6em;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      opacity: 1;
      background: var(--tabBarTab-hoverBg);
    }
  }
}
</style>
