<template>
  <CheckList
    :listGroup="typeList"
    :condition="panelType"
    :activeStyle="{ backgroundColor: this.showPanel ? '#d7e8a1' : '' }"
    @click="handleClick($event)"
  />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import CheckList from "@/renderer/components/CheckList.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { EPanelType } from "@/typings/preference";

const general = namespace("general");

@Component({
  name: "PanelType",
  components: {
    CheckList,
  },
})
export default class PanelType extends Vue {
  @general.State((state: IGeneralState) => state.appearance.showPanel)
  showPanel!: boolean;

  @general.State((state: IGeneralState) => state.appearance.panelType)
  panelType!: EPanelType;

  @general.Mutation("SET_PANEL_TYPE")
  SET_PANEL_TYPE!: (type: EPanelType) => void;

  @general.Mutation("TOGGLE_PANEL")
  TOGGLE_PANEL!: () => void;

  get typeList() {
    return {
      TOC: {
        icon: "ri-list-check",
        title: this.$t("status.TOC"),
      },
      INFO: {
        icon: "ri-information-line",
        title: this.$t("status.INFO"),
      },
      EXPORT: {
        icon: "ri-share-box-line",
        title: this.$t("status.EXPORT"),
      },
    };
  }

  handleClick(e: EPanelType) {
    if (!this.showPanel) {
      this.TOGGLE_PANEL();
      this.SET_PANEL_TYPE(e);
      return;
    }

    if (this.panelType === e) {
      this.TOGGLE_PANEL();
    } else {
      this.SET_PANEL_TYPE(e);
    }
  }
}
</script>

<style lang="less" scoped></style>
