import { ITocList } from "@/common/editor/create-toc";
import { IPanelState } from "@/interface/vuex/panel";

const state: IPanelState = {
  toc: [],
  export: {},
};

const getters = {};

const mutations = {
  SYNC_TOC: (moduleState: IPanelState, value: Array<ITocList>) => {
    moduleState.toc = value;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
