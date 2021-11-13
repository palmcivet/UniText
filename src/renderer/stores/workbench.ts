import { defineStore } from "pinia";

import { useIpc } from "@/renderer/composables/electron";
import { $id } from "@/shared/utils";
import { ITab } from "@/shared/typings/model";
import { IPC_EXPORT } from "@/shared/channel/ipc";
import { EWorkbenchType, IWorkbenchState } from "@/shared/typings/store";

export default defineStore({
  id: "workbench",

  state: (): IWorkbenchState => ({
    workbenchType: EWorkbenchType.EDITOR,
    tabList: [],
  }),

  getters: {
    showStartup(_) {
      return _.tabList.length === 0;
    },

    isEditor(_) {
      return _.workbenchType === EWorkbenchType.EDITOR;
    },
  },

  actions: {
    SYNC_TAB(tabList: Array<ITab>) {
      this.tabList = tabList;
    },

    SWITCH_WORKBENCH(type: EWorkbenchType) {
      this.workbenchType = type;
    },

    EXPORT(args: string[]) {
      switch (args[0]) {
        case "MD":
          break;
        case "HTML":
          useIpc().send(IPC_EXPORT.AS_HTML, $id("markdown-preview").innerHTML);
          break;
        case "PDF":
          useIpc().send(IPC_EXPORT.AS_PDF, $id("markdown-preview").innerHTML);
          break;
      }
    },
  },
});
