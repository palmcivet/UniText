import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { isDev } from "@/common/env";
import { IPC_OTHER } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import { IInformationState } from "@/typings/vuex/information";
import * as pkg from "@/../package.json";

const state: IInformationState = {};

const getters: GetterTree<IInformationState, IRootState> = {};

const mutations: MutationTree<IInformationState> = {
  SET_INFO: (moduleState: IInformationState, msg: string) => {
    console.log(msg);
  },
  SET_WARN: (moduleState: IInformationState, msg: string) => {
    console.log(msg);
  },
  SET_ERROR: (moduleState: IInformationState, msg: string) => {
    console.error(msg);
  },
};

const actions: ActionTree<IInformationState, IRootState> = {
  /**
   * 获取发行说明，`""` 则表明未更新
   */
  CHECK_UPDATE: (moduleState: ActionContext<IInformationState, IRootState>) => {
    if (isDev) return;

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
  LISTEN_FOR_NOTIFY: (moduleState: ActionContext<IInformationState, IRootState>) => {
    const { commit, dispatch } = moduleState;

    ipcRenderer.on(IPC_OTHER.CHECK_UPDATE, (e) => {
      dispatch("CHECK_UPDATE");
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
