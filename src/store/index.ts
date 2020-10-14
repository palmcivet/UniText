import Vue from "vue";
import Vuex, { ActionContext, ActionTree, MutationTree } from "vuex";

import panel from "./modules/panel";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import statusBar from "./modules/statusBar";
import workBench from "./modules/workBench";
import notification from "./modules/notification";
import { IRootState } from "@/typings/store";
import * as pkg from "@/../package.json";

Vue.use(Vuex);

const mutations: MutationTree<IRootState> = {
  SET_STATE: (moduleState: IRootState, msg) => {
    moduleState.general.editor = msg.editor;
    moduleState.general.appearance = msg.appearance;
    moduleState.sideBar.filesState = msg.files;
  },
};

const actions: ActionTree<IRootState, IRootState> = {
  /**
   * 获取发行说明，`""` 则表明未更新
   */
  CHECK_UPDATE: (moduleState: ActionContext<IRootState, IRootState>) => {
    const getVersion = (ver: string) =>
      ver
        .substring(1)
        .split(".")
        .map((item: string) => parseInt(item, 10));
    const currentVersion = getVersion((pkg as any).version);

    let releaseNotes = "";

    fetch("")
      .then((res) => res.json())
      .then((res) => {
        const latestVersion = getVersion(res.data.name);
        for (let i = 0; i < currentVersion.length; i += 1) {
          if (currentVersion[i] < latestVersion[i]) {
            releaseNotes = res.data;
            break;
          }
        }
      });

    // FEAT 新版本通知
    if (releaseNotes !== "") {
      moduleState.dispatch("");
    }
  },
};

export default new Vuex.Store({
  strict: true,
  modules: {
    panel,
    general,
    sideBar,
    statusBar,
    workBench,
    notification,
  },
  mutations,
  actions,
});
