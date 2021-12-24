<template>
  <div class="editor-monaco" ref="monacoRef" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditorMonaco",

  inject: ["$workbench"],

  mounted() {
    const root = this.$refs.monacoRef as HTMLElement;
    this.$workbench.invoke(root);
  },

  beforeUnmount() {
    this.$workbench.dispose();
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.editor-monaco {
  width: 100%;
  height: 100%;

  ::v-deep(.monaco-editor) {
    .scrollbar .slider {
      background: var(--scrollBar-Bg);
    }

    .scroll-decoration {
      box-shadow: var(--tabBarShadow-Color) 0 2px 2px -2px inset;
    }

    .rename-box .rename-input {
      padding: 2px;
    }
  }

  ::v-deep(.context-view .monaco-scrollable-element) {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
    border-radius: 4px;
  }

  ::v-deep(.monaco-menu .monaco-action-bar.vertical) {
    .action-item {
      border: none;
    }

    .action-label.separator {
      border-bottom-color: #e2e8f0 !important;
    }
  }

  ::v-deep(.action-menu-item) {
    color: #718096 !important;
    &:hover {
      color: #744210 !important;
      background: #fffff0 !important;
    }
  }

  ::v-deep(.decorationsOverviewRuler) {
    display: none !important;
  }
}
</style>
