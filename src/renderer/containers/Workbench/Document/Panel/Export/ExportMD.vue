<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">{{ $t("view.panel.EXPORT.grammarSpecific") }}</div>
      <FormSelect
        :value="filledFormMarkdown.scheme"
        :options="markdownOption"
        @form-change="filledFormMarkdown.scheme = $event"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from "vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";

export default defineComponent({
  name: "ExportMD",

  emits: ["export-change"],

  components: {
    FormSelect,
  },

  setup(props, { emit }) {
    // TODO 使用 markdown.ts 枚举
    const markdownOption = [
      { value: "gfm", label: "GitHub Flavored" },
      { value: "cmk", label: "CommonMark" },
      { value: "yd", label: "Youdao Note" },
    ];
    const filledFormMarkdown = reactive({
      scheme: markdownOption[0].value,
    });

    const onChange = () => {
      emit("export-change", filledFormMarkdown);
    };

    watch([filledFormMarkdown], () => {
      onChange();
    });

    onMounted(() => {
      onChange();
    });

    return {
      markdownOption,
      filledFormMarkdown,
      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
