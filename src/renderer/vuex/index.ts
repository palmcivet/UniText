import Vue from "vue";
import { ipcRenderer } from "electron";
import Vuex, { ActionContext, ActionTree, MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import workBench from "./workBench";
import statusPanel from "./statusPanel";
import information from "./information";
import { $id } from "@/common/utils";
import { THEME_PRESET, THEME_CSS, PUBLIC } from "@/common/env";
import { joinPath, checkStringExist } from "@/common/fileSystem";
import { IPC_PREFERENCE, IPC_THEME } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import { IPreference, ITheme } from "@/typings/bootstrap";
import { IThemeColorCustom } from "@/typings/service/theme";

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

  LOAD_THEME: async (_: ActionContext<IRootState, IRootState>) => {
    const { color } = ipcRenderer.sendSync(IPC_THEME.GET_ALL_SYNC) as ITheme;
    const { dynamic, preset, ...data } = color;
    const base = _.rootState.general.fileManager.folderDir;

    // TODO 更新 monacoEditor.js

    if (preset === "Custom") {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute(
          "href",
          joinPath(base, data[key as keyof IThemeColorCustom])
        );
      });
    } else if (checkStringExist(preset, THEME_PRESET)) {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", joinPath(PUBLIC.themes, preset, `${key}.css`));
      });
    } else {
      THEME_CSS.forEach((key) => {
        $id(key).setAttribute("href", joinPath(base, preset, `${key}.css`));
      });
    }
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
