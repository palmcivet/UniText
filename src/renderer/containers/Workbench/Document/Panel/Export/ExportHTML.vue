<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">{{ $t("view.panel.EXPORT.htmlTitle") }}</div>
      <FormInput
        type="text"
        :clearable="false"
        :value="filledFormHTML.title"
        @form-change="filledFormHTML.title = $event"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from "vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";

export default defineComponent({
  name: "ExportHTML",

  emits: ["export-change"],

  components: {
    FormInput,
  },

  setup(props, { emit }) {
    const filledFormHTML = reactive({
      title: "Untitled",
    });

    const onChange = () => {
      emit("export-change", filledFormHTML);
    };

    watch([filledFormHTML], () => {
      onChange();
    });

    onMounted(() => {
      onChange();
    });

    return {
      filledFormHTML,

      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
