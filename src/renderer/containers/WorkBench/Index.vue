<template>
  <div>
    <TabsWithDoc v-show="workBenchType === 0" />
    <Startup v-show="workBenchType === 1" />
    <Setting v-show="workBenchType === 2" />
  </div>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import Startup from "@/renderer/containers/WorkBench/Startup/Index.vue";
import Setting from "@/renderer/containers/WorkBench/Setting/Index.vue";
import TabsWithDoc from "@/renderer/containers/WorkBench/TabsWithDoc/Index.vue";
import { EStartup } from "@/typings/schema/preference";
import { IGeneralState } from "@/typings/vuex/general";
import { EWorkBenchType, IWorkBenchState } from "@/typings/vuex/workBench";

const general = namespace("general");
const workBench = namespace("workBench");

@Component({
  name: "WorkBench",
  components: {
    Startup,
    Setting,
    TabsWithDoc,
  },
})
export default class WorkBench extends Vue {
  @general.State((state: IGeneralState) => state.workBench.startup)
  startup!: EStartup;

  @workBench.State((state: IWorkBenchState) => state.workBenchType)
  workBenchType!: EWorkBenchType;

  @workBench.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  created() {
    if (this.startup === EStartup.CREATE) {
      this.NEW_FILE();
    }
  }
}
</script>

<style lang="less" scoped>
div {
  height: 100%;
  // TODO 统一工作台背景
  color: var(--workBench-Fg);
  background: var(--workBench-Bg);
}
</style>
