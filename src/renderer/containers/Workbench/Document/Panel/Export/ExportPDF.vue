<template>
  <div class="export-specific">
    <label class="export-form-item">
      <div class="export-form-label">页面大小</div>
      <FormSelect
        :options="pageSizeOption"
        :value="pageSizeSelect"
        @form-change="pageSizeSelect = $event"
      />

      <div class="export-form-row" v-if="isPageSizeCustom">
        <FormInput
          type="number"
          :value="pageSizeInput.width"
          @form-change="pageSizeInput.width = $event"
        >
          <template v-slot:before>
            <div class="export-form-before">宽</div>
          </template>
        </FormInput>
        <FormInput
          type="number"
          :value="pageSizeInput.height"
          @form-change="pageSizeInput.height = $event"
        >
          <template v-slot:before>
            <div class="export-form-before">长</div>
          </template>
        </FormInput>
      </div>
    </label>

    <label class="export-form-item">
      <div class="export-form-label">方向</div>
      <div class="export-form-radio">
        <FormRadio
          :options="landscapeOption"
          :value="landscape"
          @form-change="landscape = $event"
        />
      </div>
    </label>

    <label class="export-form-item">
      <div class="export-form-label">页边距</div>
      <div class="export-form-row">
        <FormInput
          type="number"
          :value="marginCSS.top"
          @form-change="margin.top = $event"
        >
          <template v-slot:before>
            <div class="export-form-before">上</div>
          </template>
        </FormInput>
        <FormInput
          type="number"
          :value="marginCSS.bottom"
          @form-change="marginCSS.bottom = $event"
        >
          <template v-slot:before>
            <div class="export-form-before">下</div>
          </template>
        </FormInput>
      </div>
      <div class="export-form-row">
        <FormInput
          type="number"
          :value="marginCSS.left"
          @form-change="marginCSS.left = $event"
        >
          <template v-slot:before>
            <div class="export-form-before">左</div>
          </template>
        </FormInput>
        <FormInput
          type="number"
          :value="marginCSS.right"
          @form-change="marginCSS.right = $event"
        >
          <template v-slot:before>
            <div class="export-form-before">右</div>
          </template>
        </FormInput>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from "vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";
import FormRadio from "@/renderer/components/Form/FormRadio.vue";
import { TMarginCSS, TPageSize, TPageSizeNumber } from "@/shared/typings/export";

export default defineComponent({
  name: "ExportPDF",

  emits: ["export-change"],

  components: {
    FormSelect,
    FormInput,
    FormRadio,
  },

  setup(props, { emit }) {
    const landscapeOption = [
      { value: false, label: "纵向" },
      { value: true, label: "横向" },
    ];
    const landscape = ref(false);

    const pageSizeOption = [
      { value: "A3", label: "A3" },
      { value: "A4", label: "A4" },
      { value: "A5", label: "A5" },
      { value: "Legal", label: "Legal" },
      { value: "Letter", label: "Letter" },
      { value: "Tabloid", label: "Tabloid" },
      { value: "Custom", label: "自定义：mm" },
    ];
    const pageSizeSelect = ref<TPageSize>("A4");
    const pageSizeInput = ref<TPageSizeNumber>({ width: 100, height: 200 });
    const isPageSizeCustom = computed(() => pageSizeSelect.value === "Custom");

    const marginCSS = reactive<TMarginCSS>({
      top: 1,
      right: 2,
      bottom: 1,
      left: 2,
    });

    const onChange = () => {
      emit("export-change", {
        landscape: landscape.value,
        pageSize: isPageSizeCustom.value ? pageSizeInput.value : pageSizeSelect.value,
        marginCSS,
      });
    };

    watch([landscape, isPageSizeCustom, marginCSS], () => {
      onChange();
    });

    onMounted(() => {
      onChange();
    });

    return {
      landscapeOption,
      landscape,
      pageSizeOption,
      pageSizeSelect,
      pageSizeInput,
      isPageSizeCustom,
      marginCSS,

      onChange,
      form: (e: any) => {
        console.log(e);
      },
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

  .export-form-row {
    width: 100%;
    display: flex;
    gap: @cell-gap;
    margin-top: @cell-gap;
  }

  .export-form-before {
    text-align: center;
    width: 2em;
    line-height: 24px;
  }
}
</style>
