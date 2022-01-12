<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">HTML 标题</div>
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
import { defineComponent, reactive } from "vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";

export default defineComponent({
  name: "ExportHTML",

  emits: ["export-change"],

  components: {
    FormInput,
  },

  setup(props, { emit }) {
    const filledFormHTML = reactive({
      title: "未命名",
    });

    const onChange = () => {
      emit("export-change");
    };

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
