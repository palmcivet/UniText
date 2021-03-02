import { ActionTree, GetterTree, MutationTree } from "vuex";

import { IRootState } from "@/typings/vuex";
import { IStatusPanelState } from "@/typings/vuex/statusPanel";

const state: IStatusPanelState = {
  toc: [],
  export: {},
};

const getters: GetterTree<IStatusPanelState, IRootState> = {
  isEmptyToc: (_: IStatusPanelState) => {
    return !!_.toc.length;
  },
};

const mutations: MutationTree<IStatusPanelState> = {
  SYNC_TOC: (_: IStatusPanelState, value: Array<ITocList>) => {
    _.toc = value;
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
