<template>
  <ul class="storage-list">
    <li>iCloud</li>
    <li>
      <i class="ri-refresh-line"></i>
    </li>
    <li>
      <i class="ri-history-line"></i>
    </li>
  </ul>

  <ul class="editor-list">
    <li :title="$t('view.panel.INFO.indent')">{{ indent }}</li>
    <li :title="$t('view.panel.INFO.encoding')">{{ encoding }}</li>
    <li :title="$t('view.panel.INFO.endOfLine')">{{ endOfLine }}</li>
  </ul>

  <ul class="tag-list">
    <!-- ri-price-tag-3-line -->
    <li v-for="(tag, index) in tagList" :key="index" :title="tag"># {{ tag }}</li>
    <li :title="$t('view.statusBar.addTag')"><i class="ri-add-line" /></li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import useWorkbench from "@/renderer/stores/workbench";

export default defineComponent({
  name: "StatusGroup",

  setup() {
    const tagList = computed(() => useWorkbench().frontmatter.config.tags.slice(0, 5));
    const indent = computed(() => useWorkbench().format.indent);
    const encoding = computed(() => useWorkbench().format.encoding);
    const endOfLine = computed(() => useWorkbench().format.endOfLine);

    return {
      tagList,
      indent,
      encoding,
      endOfLine,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";
@import "~@/renderer/styles/mixins.less";

.editor-list {
  li {
    margin: 0 0.2em;
  }
}
</style>
