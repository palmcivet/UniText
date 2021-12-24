<template>
  <div class="panel-info">
    <InfoCardDate :raw="meta.cTime" :remark="$t('panel.created')" :isCN="isCN" />
    <InfoCardDate :raw="meta.mTime" :remark="$t('panel.modified')" :isCN="isCN" />

    <div class="info-grid">
      <InfoCardNormal
        class="info-cell"
        :raw="meta.wordCount"
        :remark="$t('panel.word_count')"
      />
      <InfoCardNormal
        class="info-cell"
        :raw="meta.charCount"
        :remark="$t('panel.char_count')"
      />
    </div>

    <InfoCardTime :raw="meta.editTime" :remark="$t('panel.edit_time')" />
    <InfoCardTime :raw="meta.readTime" :remark="$t('panel.read_time')" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import InfoCardDate from "./InfoCardDate.vue";
import InfoCardTime from "./InfoCardTime.vue";
import InfoCardNormal from "./InfoCardNormal.vue";
import useWorkbench from "@/renderer/stores/workbench";

export default defineComponent({
  name: "Info",

  components: {
    InfoCardDate,
    InfoCardTime,
    InfoCardNormal,
  },

  setup() {
    const meta = computed(() => useWorkbench().frontmatter.meta);
    const properties = {
      title: ["是否已完成"],
      description: "",
    };
    const onChangeComplete = (value: boolean) => {};
    const onChangeRemark = (remark: string) => {
      console.log(remark);
    };

    return {
      meta,
      properties,
      isCN: true,
      onChangeComplete,
      onChangeRemark,
    };
  },
});
</script>

<style lang="less" scoped>
.panel-info {
  height: 100%;
  overflow-y: auto;
  color: var(--sidePanel-Fg);
  background: var(--sidePanel-Bg);

  .info-grid {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
