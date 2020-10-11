<template>
  <CheckItem
    :itemGroup="styleList"
    :condition="panelFloat ? 'true' : 'false'"
    @click="TOGGLE_PANEL_STYLE()"
  />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation, namespace } from "vuex-class";

import { IGeneralState } from "@/typings/modules/general";
import CheckItem from "@/components/CheckItem.vue";

const general = namespace("general");

@Component({
  name: "PanelStyle",
  components: {
    CheckItem,
  },
})
export default class PanelStyle extends Vue {
  @general.State((state: IGeneralState) => state.appearance.panelFloat)
  panelFloat!: boolean;

  @general.Mutation("TOGGLE_PANEL_STYLE")
  TOGGLE_PANEL_STYLE!: () => void;

  get styleList() {
    return {
      false: {
        title: "侧边栏",
        icon: "ri-side-bar-line",
      },
      true: {
        title: "浮动面板",
        icon: "ri-discuss-line",
      },
    };
  }
}
</script>

<style lang="less" scoped></style>
