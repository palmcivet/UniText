import { IPannelState } from "@/interface/pannel";
import { ITocList } from "@/common/helpers/create-toc";
import { ActionContext } from "vuex";

const state: IPannelState = {
  toc: {
    tableOfContent: [],
  },
  export: {},
};

const getters = {};

const mutations = {
  SYNC_TOC: (moduleState: IPannelState, toc: Array<ITocList>) => {
    moduleState.toc.tableOfContent = toc;
  },
};

const actions = {
  GOTO_LINE: (moduleState: ActionContext<IPannelState, any>, title?: string) => {},
  SWITCH_BLOCK: (moduleStatr: ActionContext<IPannelState, any>) => {},
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
