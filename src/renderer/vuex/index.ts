import Vue from "vue";
import Vuex, { ActionContext, ActionTree, MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import workBench from "./workBench";
import statusPanel from "./statusPanel";
import information from "./information";
import { $ } from "@/common/utils";
import { THEME_ID_APPEARANCE } from "@/common/env";
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
  },
};

const actions: ActionTree<IRootState, IRootState> = {
  SET_THEME: async (_: ActionContext<IRootState, IRootState>, theme?: string) => {
    let themeStyleEl = $(`#${THEME_ID_APPEARANCE}`);
    if (!themeStyleEl) {
      themeStyleEl = document.createElement("style");
      themeStyleEl.id = THEME_ID_APPEARANCE;
      themeStyleEl.setAttribute("type", "text/css");
      document.head.appendChild(themeStyleEl);
    }

    themeStyleEl.innerHTML = "";
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
