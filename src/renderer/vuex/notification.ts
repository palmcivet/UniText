import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { isDev } from "@/shared/env";
import { notEmpty } from "@/shared/utils";
import { IPC_OTHER, IPC_NOTIFY } from "@/shared/channel/ipc";
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

    if (releaseNotes !== "") {
      _.dispatch("NOTIFY", { level: "INFO", title: "有新版本" });
    }
  },

  LOG: (_: ActionContext<INotificationState, IRootState>, msg) => {
    ipcRenderer.send(IPC_NOTIFY.LOG, msg);
  },

  LISTEN_FOR_NOTIFY: (_: ActionContext<INotificationState, IRootState>) => {
    const { commit, dispatch } = _;

    ipcRenderer.once(IPC_NOTIFY.BOOTLOG_REPLY, (e, log: Array<any>) => {});
    ipcRenderer.send(IPC_NOTIFY.BOOTLOG_FETCH);

    dispatch("CHECK_UPDATE");

    ipcRenderer.on(IPC_OTHER.CHECK_UPDATE, (e) => {
      dispatch("CHECK_UPDATE");
    });

    ipcRenderer.on(IPC_NOTIFY.ALARM, (e, msg: INotificationMessage) => {
      dispatch("NOTIFY", msg);
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
