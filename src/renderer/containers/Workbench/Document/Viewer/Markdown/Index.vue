<template>
  <div
    id="markdown-preview"
    ref="markdownRef"
    class="line-numbers match-braces rainbow-braces"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ViewerMarkdown",

  inject: ["$viewer"],

  components: {},

  props: {},

  mounted() {
    const root = this.$refs.markdownRef as HTMLElement;
    this.$viewer.invoke(root);
  },

  beforeUnmount() {
    this.$viewer.dispose();
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

#markdown-preview {
  height: 100%;
  overflow: auto;
  padding: 1em;
  box-sizing: border-box;
  background-color: #343942;
  font-family: @normal-font-family;
  font-size: @preview-font-size;
}
</style>
