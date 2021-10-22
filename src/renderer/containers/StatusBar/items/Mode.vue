<template>
  <ul>
    <CheckItem
      :itemGroup="checkMode"
      :condition="dbColumn ? 'true' : 'false'"
      @click="TOGGLE_CHECK()"
    />
    <CheckItem
      :itemGroup="presentMode"
      :condition="readMode ? 'true' : 'false'"
      @click="setReadMode(!readMode)"
    />
  </ul>
</template>

<script lang="ts">
import CheckItem from "../widgets/CheckItem.vue";
import { IPC_OTHER } from "@/common/channel/ipc";
import { EEditMode } from "@/typings/schema/preference";
import { IGeneralState } from "@/typings/vuex/general";

const general = namespace("general");

@Component({
  name: "Mode",
  components: {
    CheckItem,
  },
})
export default class Mode extends Vue {
  @general.State((state: IGeneralState) => state.interface.editMode)
  editMode!: EEditMode;

  @general.State((state: IGeneralState) => state.interface.dbColumn)
  dbColumn!: boolean;

  @general.State((state: IGeneralState) => state.interface.readMode)
  readMode!: boolean;

  @general.Mutation("TOGGLE_CHECK")
  TOGGLE_CHECK!: () => void;

  setReadMode(mode: boolean) {
    ipcRenderer.emit(IPC_OTHER.SET_READ_MODE, null, mode);
  }

  get checkMode() {
    return {
      SOURCE: {
        false: {
          icon: "ri-code-s-slash-fill",
          title: this.$t("status.source_edit"),
        },
        true: {
          icon: "ri-layout-column-fill",
          title: this.$t("status.source_preview"),
        },
      },
      WYSIWYG: {
        false: {
          icon: "ri-text",
          title: this.$t("status.wysiwyg_write"),
        },
        true: {
          icon: "ri-code-s-slash-fill",
          title: this.$t("status.wysiwyg_source"),
        },
      },
      RICHTEXT: [{}],
    }[this.editMode];
  }

  get presentMode() {
    return {
      true: {
        icon: "ri-eye-line",
        title: this.$t("status.present_preview"),
      },
      false: {
        icon: "ri-edit-line",
        title: this.$t("status.present_edit"),
      },
    };
  }
}
</script>

<style lang="less" scoped></style>
