<template>
  <div class="panel-export">
    <div class="export-format">
      <label class="export-form-item">
        <div class="export-form-label">导出类型</div>
        <FormSelect
          :value="selectedFormat"
          :options="formatList"
          @form-change="selectedFormat = $event"
        />
      </label>
    </div>

    <div class="export-form-divider"></div>

    <ExportMD v-if="selectedFormat === FORMAT.MD" />
    <ExportHTML v-else-if="selectedFormat === FORMAT.HTML" />
    <ExportPDF v-else-if="selectedFormat === FORMAT.PDF" />
    <div class="export-specific" v-if="selectedFormat === FORMAT.IMAGE"></div>
    <div class="export-specific" v-if="selectedFormat === FORMAT.DOCX"></div>

    <div class="export-form-divider"></div>

    <div class="export-common">
      <label class="export-form-item">
        <FormInput
          type="checkbox"
          :value="checkedOption.grammar"
          @form-change="checkedOption.grammar = $event"
        />
        <div class="export-form-label">语法检查</div>
      </label>

      <label class="export-form-item">
        <FormInput
          type="checkbox"
          :value="checkedOption.reference"
          @form-change="checkedOption.reference = $event"
        />
        <div class="export-form-label">引用检查</div>
      </label>

      <label class="export-form-item">
        <FormInput
          type="checkbox"
          :value="checkedOption.reveal"
          @form-change="checkedOption.reveal = $event"
        />
        <div class="export-form-label">打开文件夹</div>
      </label>

      <div class="export-form-divider"></div>

      <label class="export-form-item">
        <FormInput
          type="checkbox"
          :value="checkedOption.theme"
          @form-change="checkedOption.theme = $event"
        />
        <div class="export-form-label">自定义样式</div>
      </label>

      <label
        class="export-form-item export-form-dynamic"
        :style="{ height: checkedOption.theme ? '24px' : '0' }"
      >
        <FormSelect
          tips="选择主题"
          :value="selectedTheme"
          :options="themeList"
          @form-change="selectedTheme = $event"
        />
      </label>

      <label class="export-form-item">
        <FormInput
          type="checkbox"
          :value="checkedOption.script"
          @form-change="checkedOption.script = $event"
        />
        <div class="export-form-label">执行脚本</div>
      </label>

      <label
        class="export-form-item export-form-dynamic"
        :style="{ height: checkedOption.script ? '24px' : '0' }"
      >
        <FormSelect
          tips="选择脚本"
          :value="selectedScript"
          :options="scriptList"
          @form-change="selectedScript = $event"
        />
      </label>
    </div>

    <div class="export-form-divider"></div>

    <div class="unitext-button" @click="onExport()">导出</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";
import ExportMD from "./ExportMD.vue";
import ExportPDF from "./ExportPDF.vue";
import ExportHTML from "./ExportHTML.vue";
import { FORMAT } from "@/shared/constant";
import useWorkbench from "@/renderer/stores/workbench";

export default defineComponent({
  name: "Export",

  components: {
    FormSelect,
    FormInput,
    ExportMD,
    ExportPDF,
    ExportHTML,
  },

  setup() {
    const formatList = [
      { value: FORMAT.MD, label: "Markdown" },
      { value: FORMAT.HTML, label: "HTML" },
      { value: FORMAT.PDF, label: "PDF" },
      { value: FORMAT.IMAGE, label: "图片" },
      { value: FORMAT.DOCX, label: "Word" },
    ];
    const selectedFormat = ref(formatList[2].value);
    const onSelectFormat = () => {};

    const checkedOption = reactive({
      grammar: true,
      reference: true,
      reveal: true,
      theme: false,
      script: false,
    });
    const themeList = ref([{ value: "", label: "" }]);
    const selectedTheme = ref(themeList.value[0].value);
    const scriptList = ref([{ value: "", label: "" }]);
    const selectedScript = ref(scriptList.value[0].value);

    const onExport = () => {
      console.log(
        selectedFormat.value,
        checkedOption,
        checkedOption.theme && selectedTheme.value,
        checkedOption.script && selectedScript.value
      );

      switch (selectedFormat.value) {
        case FORMAT.MD:
          useWorkbench().EXPORT_MD();
          break;
        case FORMAT.HTML:
          useWorkbench().EXPORT_HTML();
          break;
        case FORMAT.PDF:
          useWorkbench().EXPORT_PDF();
          break;
        default:
          break;
      }
    };

    const filledFormImage = reactive({});

    const filledFormDocx = reactive({});

    return {
      FORMAT,
      formatList,
      selectedFormat,
      onSelectFormat,

      checkedOption,

      themeList,
      selectedTheme,
      scriptList,
      selectedScript,

      onExport,

      filledFormImage,
      filledFormDocx,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.panel-export {
  width: 100%;
  height: 100%;
  overflow-y: overlay;
  font-size: 14px;
  padding: 0 @cell-gap;
  display: flex;
  flex-direction: column;
  align-items: center;

  .export-format {
    .export-form-label {
      margin: @cell-gap 0 calc(@cell-gap / 2);
    }

    .export-form-item {
      flex-direction: column;

      ::v-deep(.form-select) {
        text-align: center;
      }
    }
  }

  .export-common {
    min-width: 80%;

    .export-form-label {
      cursor: pointer;
    }

    ::v-deep(.form-input) {
      margin-left: 8%;
      margin-right: 5%;
      height: 24px;
    }

    ::v-deep(.form-select) {
      margin-left: calc(13% + 13px);
    }
  }

  .unitext-button {
    width: 80%;
  }
}
</style>
