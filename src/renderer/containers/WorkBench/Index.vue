<template>
  <LayoutBox
    :totalWidth="containerWidth"
    :showMinor="isShowPanel && !isPanelFloat"
    :threWidth="[150, 250]"
  >
    <template v-slot:left>
      <TabsWithDoc v-show="workBenchType === 0" />
      <Startup v-show="workBenchType === 1" />
      <Setting v-show="workBenchType === 2" />
      <!-- TODO 将 panel 放入 TabsWithDoc -->
      <SidePanel :fixed="false" />
    </template>
    <template v-slot:right>
      <SidePanel :fixed="true" />
    </template>
  </LayoutBox>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import { BUS_UI } from "@/common/channel/bus";
import SidePanel from "@/renderer/containers/SidePanel/Index.vue";
import Startup from "@/renderer/containers/WorkBench/Startup/Index.vue";
import Setting from "@/renderer/containers/WorkBench/Setting/Index.vue";
import TabsWithDoc from "@/renderer/containers/WorkBench/TabsWithDoc/Index.vue";
import LayoutBox from "@/renderer/components/LayoutBox.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { EStartup } from "@/typings/service/preference";
import { EWorkBenchType, IWorkBenchState } from "@/typings/vuex/workBench";

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
  @general.State((state: IGeneralState) => state.interface.showPanel)
  isShowPanel!: boolean;

  @general.State((state: IGeneralState) => state.interface.panelFloat)
  isPanelFloat!: boolean;

  @general.State((state: IGeneralState) => state.system.startup)
  startup!: EStartup;

  @workBench.State((state: IWorkBenchState) => state.workBenchType)
  workBenchType!: EWorkBenchType;

  @workBench.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  containerWidth = 0;

  handleResize() {
    this.containerWidth = (this.$el as HTMLElement).offsetWidth;
  }

  created() {
    if (this.startup === EStartup.CREATE) {
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
