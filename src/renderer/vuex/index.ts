import Vue from "vue";
import { ipcRenderer } from "electron";
import Vuex, { ActionContext, ActionTree, MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import workBench from "./workBench";
import statusPanel from "./statusPanel";
import information from "./information";
import { IPC_PREFERENCE } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import { IPreference } from "@/typings/schema/preference";

Vue.use(Vuex);

const mutations: MutationTree<IRootState> = {
  SET_STATE: (_: IRootState, msg: IPreference) => {
    Vue.set(_.general, "system", msg.system);
    Vue.set(_.general, "interface", msg.interface);
    Vue.set(_.general, "fileManager", msg.fileManager);
    Vue.set(_.general, "editor", msg.editor);
    Vue.set(_.general, "document", msg.document);
  },
};

const actions: ActionTree<IRootState, IRootState> = {
  LOAD_STATE: (_: ActionContext<IRootState, IRootState>) => {
    _.commit("SET_STATE", ipcRenderer.sendSync(IPC_PREFERENCE.GET_ALL_SYNC));
  },
};

export default new Vuex.Store({
  strict: true,
  actions,
  mutations,
  modules: {
    general,
    sideBar,
    workBench,
    statusPanel,
    information,
  },
});
