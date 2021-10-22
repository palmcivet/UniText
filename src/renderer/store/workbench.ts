import { defineStore } from "pinia";

import { EWorkbenchType, IWorkbenchState } from "@/typings/store/workBench";

export default defineStore({
  id: "workbench",

  state: () =>
    ({
      workbenchType: EWorkbenchType.DOCUMENT,
    } as IWorkbenchState),

  getters: {},

  actions: {
    SWITCH_WORKBENCH(type: EWorkbenchType) {
      this.workbenchType = type;
    },
  },
});
