<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">页面大小</div>

      <FormInput
        type="number"
        :value="filledFormPDF.width"
        @form-change="filledFormPDF.width = $event"
      />
      <FormInput
        type="number"
        :value="filledFormPDF.height"
        @form-change="filledFormPDF.height = $event"
      />
    </label>

    <label class="export-form-item">
      <div class="export-form-label">方向</div>
      <div class="export-form-radio">
        <FormRadio
          :options="sizeOption"
          :value="filledFormPDF.size"
          @form-change="filledFormPDF.size = $event"
        />
      </div>
    </label>

    <label class="export-form-item">
      <div class="export-form-label">页边距</div>

      <FormInput
        type="number"
        :value="filledFormPDF.top"
        @form-change="filledFormPDF.top = $event"
      />
      <FormInput
        type="number"
        :value="filledFormPDF.right"
        @form-change="filledFormPDF.right = $event"
      />
      <FormInput
        type="number"
        :value="filledFormPDF.bottom"
        @form-change="filledFormPDF.bottom = $event"
      />
      <FormInput
        type="number"
        :value="filledFormPDF.left"
        @form-change="filledFormPDF.left = $event"
      />
    </label>

    <label class="export-form-item">
      <div class="export-form-label">页眉</div>
      <FormInput
        type="number"
        :value="filledFormPDF.left"
        @form-change="filledFormPDF.left = $event"
      />
    </label>

    <label class="export-form-item">
      <div class="export-form-label">页脚</div>
      <FormInput
        type="number"
        :value="filledFormPDF.left"
        @form-change="filledFormPDF.left = $event"
      />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";
import FormRadio from "@/renderer/components/Form/FormRadio.vue";

export default defineComponent({
  name: "ExportPDF",

  emits: ["export-change"],

  components: {
    FormSelect,
    FormInput,
    FormRadio,
  },

  setup(props, { emit }) {
    const sizeOption = [
      { value: "portrait", label: "纵向" },
      { value: "landscape", label: "横向" },
    ];
    const filledFormPDF = reactive({
      width: 2480,
      height: 3508,
      size: sizeOption[0].value,
      top: 1,
      right: 2,
      bottom: 1,
      left: 2,
    });

    const onChange = () => {
      emit("export-change");
    };

    return {
      sizeOption,
      filledFormPDF,
      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.export-specific {
  .export-form-radio {
    display: flex;
    justify-content: space-between;

    ::v-deep(.form-radio) {
      width: 50%;

      .form-radio__label {
        padding-left: 5%;
      }
    }
  }
}
</style>
