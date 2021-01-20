import Vue from "vue";
import Vuex, { MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import workBench from "./workBench";
import statusPanel from "./statusPanel";
import information from "./information";
import { IRootState } from "@/typings/vuex";

Vue.use(Vuex);

const mutations: MutationTree<IRootState> = {
  SET_STATE: (moduleState: IRootState, msg) => {
    Vue.set(moduleState.general, "editor", msg.editor);
    Vue.set(moduleState.general, "appearance", msg.appearance);
    Vue.set(moduleState.sideBar, "filesState", msg.files);
  },
};

export default new Vuex.Store({
  strict: true,
  modules: {
    general,
    sideBar,
    workBench,
    statusPanel,
    information,
  },
  mutations,
});
