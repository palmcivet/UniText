import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { IPC_EXPORT } from "@/shared/channel/ipc";
import { BUS_EDITOR } from "@/shared/channel/bus";
import { $id } from "@/shared/utils";
import { Bus } from "@/renderer/plugins/VueBus";
import { IRootState } from "@/typings/vuex";
import { IStatusPanelState } from "@/typings/vuex/statusPanel";

let shouldSync = true;

const state: IStatusPanelState = {
  toc: [],
  export: {},
  imageList: [],
};

const getters: GetterTree<IStatusPanelState, IRootState> = {
  isEmptyToc: (_: IStatusPanelState) => {
    return !!_.toc.length;
  },
};

const mutations: MutationTree<IStatusPanelState> = {
  SYNC_TOC: (_: IStatusPanelState, value: Array<ITocItem>) => {
    _.toc = value;
  },
  SYNC_IMGLIST: (_: IStatusPanelState, value: Array<string>) => {
    if (shouldSync) _.imageList = value;
    shouldSync = !shouldSync;
  },
};

const actions: ActionTree<IStatusPanelState, IRootState> = {
  EXPORT: (_: ActionContext<IStatusPanelState, IRootState>, args: string[]) => {
    switch (args[0]) {
      case "MD":
        break;
      case "HTML":
        ipcRenderer.send(IPC_EXPORT.AS_HTML, $id("markdown-preview").innerHTML);
        break;
      case "PDF":
        ipcRenderer.send(IPC_EXPORT.AS_PDF, $id("markdown-preview").innerHTML);
        break;
    }
  },

  LISTEN_FOR_STATUS: (_: ActionContext<IStatusPanelState, IRootState>) => {
    const { commit } = _;

    Bus.on(BUS_EDITOR.SYNC_TOC, (toc) => commit("SYNC_TOC", toc));
    Bus.on(BUS_EDITOR.SYNC_IMGLIST, (list: any) => commit("SYNC_IMGLIST", list));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
