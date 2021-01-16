import { ActionTree, GetterTree, MutationTree } from "vuex";

import { ITocList } from "@/common/editor/create-toc";
import { IStatusPanelState } from "@/typings/vuex/statusPanel";
import { IRootState } from "@/typings/vuex";

const state: IStatusPanelState = {
  toc: [],
  export: {},
};

const getters: GetterTree<IStatusPanelState, IRootState> = {
  isEmptyToc: (moduleState: IStatusPanelState) => {
    return !!moduleState.toc.length;
  },
};

const mutations: MutationTree<IStatusPanelState> = {
  SYNC_TOC: (moduleState: IStatusPanelState, value: Array<ITocList>) => {
    moduleState.toc = value;
  },
};

const actions: ActionTree<IStatusPanelState, IRootState> = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
