<template>
  <details class="search-node-group" :open="!isCollapsed">
    <summary class="search-node" @click.prevent="onToggle()">
      <i
        class="icon-indicator"
        :class="isCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'"
      />
      <i class="icon-file ri-markdown-line"></i>
      <div class="node-label">
        {{ trailPath(result.filePath) }}
        <div class="node-path"></div>
      </div>
      <i class="icon-close ri-close-line"></i>
    </summary>
    <ul class="search-node-list">
      <li
        class="search-node"
        v-for="(match, index) in result.matches"
        :key="index"
        @click="onReveal(result.filePath, match.range)"
      >
        <i class="icon-indicator"></i>
        <div class="node-label">{{ match.lineText }}</div>
        <i class="icon-close ri-close-line"></i>
      </li>
    </ul>
  </details>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { IRipgrepSearchResult } from "@/main/utils/ripgrep";

export default defineComponent({
  name: "BrowserSearchNode",

  emits: ["node-reveal"],

  props: {
    result: { type: Object as PropType<IRipgrepSearchResult>, required: true },
  },

  setup(props, { emit }) {
    const trailPath = (path: string) => {
      const dirs = path.split("/");
      return dirs[dirs.length - 1];
    };

    const isCollapsed = ref(false);
    const onToggle = () => {
      isCollapsed.value = !isCollapsed.value;
    };

    const onReveal = (...args: Array<any>) => {
      emit("node-reveal", ...args);
    };

    return {
      trailPath,
      isCollapsed,
      onToggle,
      onReveal,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";
@import "~@/renderer/styles/mixins.less";

.search-node {
  @icon-width: 16px;

  &-group {
    display: flex;
  }

  &-list {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  display: flex;
  cursor: pointer;
  position: relative;
  color: var(--workBench-Fg);

  &:hover {
    color: var(--sideBarItem-hoverFg);
    background: var(--sideBarItem-hoverBg);
  }

  i {
    width: @icon-width;
    height: @sideBar-item-height;
    line-height: @sideBar-item-height;
    font-size: @icon-font-size-normal;
    text-align: center;
  }

  .node-label {
    max-width: calc(100% - @icon-width * 3);
    user-select: none;
    line-height: @sideBar-item-height;
    font-size: @font-size-normal;
    .ellipsis();
  }

  .icon-file {
    margin-right: 6px;
  }

  .icon-close {
    visibility: hidden;
    position: absolute;
    right: 6px;
  }

  &:hover .icon-close {
    visibility: visible;
  }
}
</style>
