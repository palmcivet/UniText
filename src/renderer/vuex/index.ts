import Vue from "vue";
import Vuex, { ActionContext, ActionTree, MutationTree } from "vuex";

import general from "./general";
import sideBar from "./sideBar";
import statusPanel from "./statusPanel";
import workBench from "./workBench";
import { IRootState } from "@/typings/vuex";
import * as pkg from "@/../package.json";

Vue.use(Vuex);

const mutations: MutationTree<IRootState> = {
  SET_STATE: (moduleState: IRootState, msg) => {
    Vue.set(moduleState.general, "editor", msg.editor);
    Vue.set(moduleState.general, "appearance", msg.appearance);
    Vue.set(moduleState.sideBar, "filesState", msg.files);
  },
  SET_INFO: (moduleState: IRootState, msg: string) => {
    console.log(msg);
  },
  SET_WARN: (moduleState: IRootState, msg: string) => {
    console.log(msg);
  },
  SET_ERROR: (moduleState: IRootState, msg: string) => {
    console.error(msg);
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
    general,
    sideBar,
    statusPanel,
    workBench,
  },
  mutations,
  actions,
});
