<template>
  <check-list
    :listGroup="typeList"
    :condition="panelType"
    @click="SET_PANEL_TYPE($event)"
  />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";

import { IGeneralState, EPanelType } from "@/interface/vuex/general";
import CheckList from "@/component/widgets/CheckList/Index.vue";

const general = namespace("general");

@Component({
  name: "PanelType",
  components: {
    CheckList,
  },
})
export default class PanelType extends Vue {
  @general.State((state: IGeneralState) => state.appearance.panelType)
  panelType!: EPanelType;

  @general.Mutation("SET_PANEL_TYPE")
  SET_PANEL_TYPE!: (type: EPanelType) => void;

  get typeList() {
    return {
      TOC: {
        title: "大纲",
        icon: "ri-list-check",
      },
      INFO: {
        title: "信息",
        icon: "ri-information-line",
      },
      EXPORT: {
        title: "导出",
        icon: "ri-share-box-line",
      },
    };
  }
}
</script>

<style lang="less" scoped></style>
