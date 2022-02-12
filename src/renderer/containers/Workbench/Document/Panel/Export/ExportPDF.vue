<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">{{ $t("view.panel.EXPORT.pageSize") }}</div>
      <FormSelect
        :options="pageSizeOption"
        :value="pageSizeSelect"
        @form-change="pageSizeSelect = $event"
      />
    </label>

    <template v-if="isPageSizeCustom">
      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.pageWidth") }}</div>
        <FormInput
          type="number"
          :value="pageSizeInput.width"
          @form-change="pageSizeInput.width = $event"
        />
      </label>
      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.pageHeight") }}</div>
        <FormInput
          type="number"
          :value="pageSizeInput.height"
          @form-change="pageSizeInput.height = $event"
        />
      </label>
    </template>

    <label class="export-form-item">
      <div class="export-form-label">{{ $t("view.panel.EXPORT.direction") }}</div>
      <div class="export-form-radio">
        <FormRadio
          :options="landscapeOption"
          :value="landscape"
          @form-change="landscape = $event"
        />
      </div>
    </label>

    <label class="export-form-item">
      <div class="export-form-label">{{ $t("view.panel.EXPORT.pageMargin") }}</div>

      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.marginUnit") }}</div>
        <FormSelect
          :options="marginUnitOption"
          :value="marginUnit"
          @form-change="marginUnit = $event"
        />
      </label>

      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.marginTop") }}</div>
        <FormInput
          type="number"
          :value="marginCSS.top"
          @form-change="marginCSS.top = $event"
        />
        <div class="export-row-unit">{{ marginUnit }}</div>
      </label>

      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.marginBottom") }}</div>
        <FormInput
          type="number"
          :value="marginCSS.bottom"
          @form-change="marginCSS.bottom = $event"
        />
        <div class="export-row-unit">{{ marginUnit }}</div>
      </label>

      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.marginLeft") }}</div>
        <FormInput
          type="number"
          :value="marginCSS.left"
          @form-change="marginCSS.left = $event"
        />
        <div class="export-row-unit">{{ marginUnit }}</div>
      </label>

      <label class="export-row">
        <div class="export-row-label">{{ $t("view.panel.EXPORT.marginRight") }}</div>
        <FormInput
          type="number"
          :value="marginCSS.right"
          @form-change="marginCSS.right = $event"
        />
        <div class="export-row-unit">{{ marginUnit }}</div>
      </label>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";
import FormRadio from "@/renderer/components/Form/FormRadio.vue";
import { TMarginCSS, TPageSize, TPageSizeNumber } from "@/shared/typings/export";
import { i18n } from "@/renderer/i18n";

export default defineComponent({
  name: "ExportPDF",

  emits: ["export-change"],

  components: {
    FormSelect,
    FormInput,
    FormRadio,
  },

  setup(props, { emit }) {
    const { t } = i18n.global;

    const landscapeOption = computed(() => [
      { value: false, label: t("view.panel.EXPORT.vertical") },
      { value: true, label: t("view.panel.EXPORT.horizontal") },
    ]);
    const landscape = ref(false);

    const pageSizeOption = [
      { value: "A3", label: "A3" },
      { value: "A4", label: "A4" },
      { value: "A5", label: "A5" },
      { value: "Legal", label: "Legal" },
      { value: "Letter", label: "Letter" },
      { value: "Tabloid", label: "Tabloid" },
      { value: "Custom", label: t("view.panel.EXPORT.customUnit") },
    ];
    const pageSizeSelect = ref<TPageSize>("A4");
    const pageSizeInput = ref<TPageSizeNumber>({ width: 210, height: 297 });
    const isPageSizeCustom = computed(() => pageSizeSelect.value === "Custom");

    const marginCSS = reactive<Record<keyof TMarginCSS, number>>({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
    const marginUnitOption = [
      { value: "cm", label: "cm" },
      { value: "mm", label: "mm" },
      { value: "px", label: "px" },
    ];
    const marginUnit = ref(marginUnitOption[0].value);

    const onChange = () => {
      emit("export-change", {
        landscape: landscape.value,
        pageSize: isPageSizeCustom.value ? pageSizeInput.value : pageSizeSelect.value,
        marginCSS: {
          top: `${marginCSS.top}${marginUnit.value}`,
          bottom: `${marginCSS.bottom}${marginUnit.value}`,
          left: `${marginCSS.left}${marginUnit.value}`,
          right: `${marginCSS.right}${marginUnit.value}`,
        },
      });
    };

    watch([landscape, isPageSizeCustom, marginCSS], () => onChange());

    onMounted(() => onChange());

    return {
      landscapeOption,
      landscape,

      pageSizeOption,
      pageSizeSelect,
      pageSizeInput,
      isPageSizeCustom,

      marginCSS,
      marginUnitOption,
      marginUnit,

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

    ::v-deep(.form-radio) {
      width: 50%;
      text-align: center;

      .form-radio__label {
        padding-left: 5%;
      }
    }
  }

  .export-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: @cell-gap;
    line-height: @row-height;

    &-label {
      min-width: 30%;
      text-align: right;
      padding-right: 2%;
    }

    &-unit {
      width: 15%;
      padding-left: 2%;
      text-align: center;
    }

    .form-input {
      min-width: 30%;
      height: @row-height;
    }
  }
}
</style>
