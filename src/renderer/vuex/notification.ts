import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { isDev } from "@/common/env";
import { notEmpty } from "@/common/utils";
import { IPC_OTHER } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import { INotificationMessage, INotificationState } from "@/typings/vuex/notification";

const state: INotificationState = {
  hasFetched: false,
  hasMounted: false,
  showMessage: false,
  messageQueue: [],
};

const getters: GetterTree<INotificationState, IRootState> = {
  hasMessage: (_: INotificationState) => {
    return notEmpty(_.messageQueue);
  },
};

const mutations: MutationTree<INotificationState> = {
  SET_FETCHED: (_: INotificationState) => {
    _.hasFetched = true;
  },

  SET_MOUNTED: (_: INotificationState) => {
    _.hasMounted = true;
  },

  NOTIFY: (_: INotificationState, msg: INotificationMessage) => {
    _.messageQueue.push(msg);
    console.info(msg.title);
  },

  CLEAR_MESSAGE: (_: INotificationState, idx: number) => {
    _.messageQueue.splice(idx, 1);
  },

  CLEAR_ALL: (_: INotificationState) => {
    _.messageQueue = [];
  },

  CLOSE_PANEL: (_: INotificationState) => {
    _.showMessage = !_.showMessage;
  },
};

const actions: ActionTree<INotificationState, IRootState> = {
  /**
   * 获取发行说明，`""` 则表明未更新
   */
  CHECK_UPDATE: (_: ActionContext<INotificationState, IRootState>) => {
    if (isDev) return;

    const getVersion = (ver: string) =>
      ver
        .substring(1)
        .split(".")
        .map((item: string) => parseInt(item, 10));
    const currentVersion = getVersion(process.versions.UNITEXT_VERSION as string);

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

    // NOTE 新版本通知
    if (releaseNotes !== "") {
      _.dispatch("");
    }
  },

  LISTEN_FOR_NOTIFY: (_: ActionContext<INotificationState, IRootState>) => {
    const { commit, dispatch } = _;

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
