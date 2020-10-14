import { ActionTree, GetterTree, MutationTree } from "vuex";

import { ITocList } from "@/common/editor/create-toc";
import { IPanelState } from "@/typings/modules/panel";
import { IRootState } from "@/typings/store";

const state: IPanelState = {
  toc: [],
  export: {},
};

const getters: GetterTree<IPanelState, IRootState> = {
  isEmptyToc: (moduleState: IPanelState) => {
    return !!moduleState.toc.length;
  },
};

const mutations: MutationTree<IPanelState> = {
  SYNC_TOC: (moduleState: IPanelState, value: Array<ITocList>) => {
    moduleState.toc = value;
  },
};

const actions: ActionTree<IPanelState, IRootState> = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
