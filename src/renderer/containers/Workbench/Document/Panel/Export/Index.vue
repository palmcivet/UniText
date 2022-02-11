<template>
  <div class="panel-export">
    <div class="panel-export__wrapper">
      <div class="export-common">
        <label class="export-form-item">
          <FormInput
            type="checkbox"
            :value="checkedOption.grammar"
            @form-change="checkedOption.grammar = $event"
          />
          <div class="export-form-label">{{ $t("view.panel.EXPORT.checkGramma") }}</div>
        </label>

        <label class="export-form-item">
          <FormInput
            type="checkbox"
            :value="checkedOption.reference"
            @form-change="checkedOption.reference = $event"
          />
          <div class="export-form-label">
            {{ $t("view.panel.EXPORT.checkReference") }}
          </div>
        </label>

        <label class="export-form-item">
          <FormInput
            type="checkbox"
            :value="checkedOption.reveal"
            @form-change="checkedOption.reveal = $event"
          />
          <div class="export-form-label">{{ $t("view.panel.EXPORT.openFolder") }}</div>
        </label>

        <label class="export-form-item">
          <FormInput
            type="checkbox"
            :value="checkedOption.theme"
            @form-change="checkedOption.theme = $event"
          />
          <div class="export-form-label">{{ $t("view.panel.EXPORT.customTheme") }}</div>
        </label>

        <label
          class="export-form-item export-form-dynamic"
          :style="{ height: checkedOption.theme ? '24px' : '0' }"
        >
          <FormSelect
            :tips="$t('view.panel.EXPORT.selectTheme')"
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
          <div class="export-form-label">{{ $t("view.panel.EXPORT.executeScript") }}</div>
        </label>

        <label
          class="export-form-item export-form-dynamic"
          :style="{ height: checkedOption.script ? '24px' : '0' }"
        >
          <FormSelect
            :tips="$t('view.panel.EXPORT.selectScript')"
            :value="selectedScript"
            :options="scriptList"
            @form-change="selectedScript = $event"
          />
        </label>
      </div>

      <div class="export-format">
        <label class="export-form-item">
          <div class="export-form-label">{{ $t("view.panel.EXPORT.exportFormat") }}</div>
          <FormSelect
            :value="selectedFormat"
            :options="formatList"
            @form-change="selectedFormat = $event"
          />
        </label>
      </div>

      <ExportMD
        v-if="selectedFormat === FORMAT.MD"
        @export-change="onChangeFormatForm($event)"
      />
      <ExportHTML
        v-else-if="selectedFormat === FORMAT.HTML"
        @export-change="onChangeFormatForm($event)"
      />
      <ExportPDF
        v-else-if="selectedFormat === FORMAT.PDF"
        @export-change="onChangeFormatForm($event)"
      />
      <div v-if="selectedFormat === FORMAT.IMAGE"></div>
      <div v-if="selectedFormat === FORMAT.DOCX"></div>
    </div>

    <div class="panel-export__controls">
      <button class="unitext-button" @click="onExport()">
        {{ $t("view.panel.EXPORT.exportButton") }}
      </button>
    </div>
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

  inject: ["$theme"],

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
      { value: FORMAT.IMAGE, label: "Image" },
      { value: FORMAT.DOCX, label: "Word" },
    ];
    const selectedFormat = ref(formatList[2].value);

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

    const filledForm = ref<any>();
    const onChangeFormatForm = (form: any) => (filledForm.value = form);

    const onExport = () => {
      switch (selectedFormat.value) {
        case FORMAT.MD:
          useWorkbench().EXPORT_MD(filledForm.value);
          break;
        case FORMAT.HTML:
          useWorkbench().EXPORT_HTML(filledForm.value, checkedOption.reveal);
          break;
        case FORMAT.PDF:
          useWorkbench().EXPORT_PDF(filledForm.value, checkedOption.reveal);
          break;
        default:
          break;
      }
    };

    return {
      FORMAT,
      formatList,
      selectedFormat,

      checkedOption,

      filledForm,
      onChangeFormatForm,

      themeList,
      selectedTheme,
      scriptList,
      selectedScript,

      onExport,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.panel-export {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  font-size: 14px;

  @controls-height: 40px;

  &__wrapper {
    max-height: calc(100% - @controls-height);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 0 @cell-gap;

    .export-common {
      .export-form-label {
        cursor: pointer;
      }

      ::v-deep(.form-input) {
        margin-right: 5%;
        height: @row-height;
      }

      ::v-deep(.form-select) {
        margin-left: calc(5% + 13px);
      }
    }

    .export-format {
      .export-form-label {
        margin: @cell-gap 0 calc(@cell-gap / 2);
      }

      .export-form-item {
        flex-direction: column;
      }
    }
  }

  &__controls {
    height: @controls-height;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .unitext-button {
      width: 80%;
    }
  }
}
</style>
