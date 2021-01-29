<template>
  <LayoutBox
    :totalWidth="containerWidth"
    :showMinor="isShowPanel && !isPanelFloat"
    :threWidth="[150, 250]"
  >
    <template v-slot:left>
      <TabsWithDoc v-show="!isBlank" />
      <Startup v-show="isBlank" />
      <Setting />
    </template>
    <template v-slot:right>
      <SidePanel :fixed="true" />
    </template>
  </LayoutBox>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Startup from "./Startup/Index.vue";
import Setting from "./Setting/Index.vue";
import SidePanel from "../SidePanel/Index.vue";
import TabsWithDoc from "./TabsWithDoc/Index.vue";
import { BUS_UI } from "@/common/channel/bus";
import LayoutBox from "@/renderer/components/LayoutBox.vue";
import { IGeneralState } from "@/typings/vuex/general";

const general = namespace("general");
const workBench = namespace("workBench");

@Component({
  name: "WorkBench",
  components: {
    LayoutBox,
    Startup,
    Setting,
    SidePanel,
    TabsWithDoc,
  },
})
export default class WorkBench extends Vue {
  @workBench.Getter("isBlank")
  isBlank!: boolean;

  @workBench.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  @general.State((state: IGeneralState) => state.appearance.showPanel)
  isShowPanel!: boolean;

  @general.State((state: IGeneralState) => state.appearance.panelFloat)
  isPanelFloat!: boolean;

  @general.State((state: IGeneralState) => state.editor.startUp)
  startUp!: boolean;

  containerWidth = 0;

  handleResize() {
    this.containerWidth = (this.$el as HTMLElement).offsetWidth;
  }

  created() {
    if (this.startUp) {
      this.NEW_FILE();
    }
  }

  mounted() {
    this.$nextTick(() => {
      this.containerWidth = (this.$el as HTMLElement).offsetWidth;
      this.$bus.on(BUS_UI.SYNC_RESIZE, this.handleResize);
    });
  }

  beforeDestroy() {
    this.$bus.off(BUS_UI.SYNC_RESIZE, this.handleResize);
  }
}
</script>

<style lang="less" scoped></style>
