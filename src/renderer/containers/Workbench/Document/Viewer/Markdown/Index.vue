<template>
  <div
    :id="ID_PREVIEW"
    ref="markdownRef"
    class="viewer-markdown line-numbers match-braces rainbow-braces"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ID_PREVIEW } from "@/shared/constant";

export default defineComponent({
  name: "ViewerMarkdown",

  inject: ["$viewer"],

  components: {},

  props: {},

  data() {
    return {
      ID_PREVIEW,
    };
  },

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
@import "~@/renderer/styles/vars.less";

.viewer-markdown {
  height: 100%;
  overflow: auto;
  padding: 1em;
  box-sizing: border-box;
  font-family: @normal-font-family;
  font-size: @preview-font-size;
}
</style>
