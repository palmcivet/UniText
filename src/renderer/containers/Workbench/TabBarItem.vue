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
import { ITab } from "@/shared/typings/renderer";

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
@import "~@/renderer/styles/vars.less";
@import "~@/renderer/styles/mixins.less";

.tab-bar-item {
  cursor: pointer;
  padding: 0 1.8em 0 0.8em;
  position: relative;

  height: @tabBar-height;
  color: var(--u-workbench-tab-active-fg);
  background-color: var(--u-workbench-tab-active-bg);
  border-right: 1px solid var(--u-workbench-tab-divider-v-bg);

  &:hover {
    opacity: 0.9;
    color: var(--u-workbench-tab-hover-fg);
    background-color: var(--u-workbench-tab-hover-bg);
  }

  &.active {
    border-bottom: @tabBar-underline-width solid var(--u-workbench-tab-divider-h-bg);
  }

  &.inactive {
    opacity: 0.5;
  }

  &.ghost {
    opacity: 0.5;
    color: var(--u-workbench-tab-drag-fg);
    background-color: var(--u-workbench-tab-drag-bg);
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
    }
  }
}
</style>
