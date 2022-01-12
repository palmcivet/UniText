<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">导出格式</div>
      <FormSelect
        :value="filledFormMarkdown.scheme"
        :options="markdownOption"
        @form-change="filledFormMarkdown.scheme = $event"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";

export default defineComponent({
  name: "ExportMD",

  emits: ["export-change"],

  components: {
    FormSelect,
  },

  setup(props, { emit }) {
    const markdownOption = [
      { value: "gfm", label: "GitHub Flavored" },
      { value: "cmk", label: "CommonMark" },
      { value: "yd", label: "有道云笔记" },
    ];
    const filledFormMarkdown = reactive({
      scheme: markdownOption[0].value,
    });

    const onChange = () => {
      emit("export-change");
    };

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
