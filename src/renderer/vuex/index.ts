import Vue from "vue";
import { ipcRenderer } from "electron";
import Vuex, { ActionContext, ActionTree, MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import workBench from "./workBench";
import statusPanel from "./statusPanel";
import information from "./information";
import { $ } from "@/common/utils";
import { THEME_ID } from "@/common/env";
import { joinPath } from "@/common/fileSystem";
import { IPC_PREFERENCE } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import { IPreference } from "@/typings/bootstrap";

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

  LOAD_THEME: async (_: ActionContext<IRootState, IRootState>, theme?: string) => {
    $(`#${THEME_ID.APPEARANCE}`).setAttribute(
      "href",
      joinPath("themes", "OneDarkPro", "appearance.css")
    );

    $(`#${THEME_ID.RENDER_VIEW}`).setAttribute(
      "href",
      joinPath("themes", "OneDarkPro", "render_view.css")
    );

    $(`#${THEME_ID.RENDER_CODE}`).setAttribute(
      "href",
      joinPath("themes", "OneDarkPro", "render_code.css")
    );
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
