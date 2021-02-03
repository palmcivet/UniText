import Vue from "vue";
import Vuex, { MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import workBench from "./workBench";
import statusPanel from "./statusPanel";
import information from "./information";
import { IRootState } from "@/typings/vuex";
import { IPreference } from "@/typings/bootstrap";

Vue.use(Vuex);

const mutations: MutationTree<IRootState> = {
  SET_STATE: (_: IRootState, msg: IPreference) => {
    Vue.set(_.general, "system", msg.system);
    Vue.set(_.general, "userInterface", msg.userInterface);
    Vue.set(_.general, "fileManager", msg.fileManager);
    Vue.set(_.general, "editor", msg.editor);
    Vue.set(_.general, "document", msg.document);
    Vue.set(_.general, "markdown", msg.markdown);
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
