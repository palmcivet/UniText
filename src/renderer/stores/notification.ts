import { defineStore } from "pinia";

import { isDev } from "@/shared/constant";
import { arrayHasElements } from "@/shared/utils";
import { INotificationMessage, INotificationState } from "@/shared/typings/store";

export default defineStore({
  id: "notification",

  state: (): INotificationState => ({
    hasFetched: false,
    hasMounted: false,
    showMessage: false,
    messageQueue: [],
  }),

  getters: {
    hasMessage(_) {
      return arrayHasElements(_.messageQueue);
    },
  },

  actions: {
    SET_FETCHED() {
      this.hasFetched = true;
    },

    SET_MOUNTED() {
      this.hasMounted = true;
    },

    NOTIFY(msg: INotificationMessage) {
      this.messageQueue.push(msg);
    },

    CLEAR_MESSAGE(idx: number) {
      this.messageQueue.splice(idx, 1);
    },

    CLEAR_ALL() {
      this.messageQueue = [];
    },

    CLOSE_PANEL() {
      this.showMessage = !this.showMessage;
    },

    /**
     * 获取发行说明，`""` 则表明未更新
     */
    async CHECK_UPDATE() {
      if (isDev) return;

      const getVersion = (ver: string) =>
        ver
          .substring(1)
          .split(".")
          .map((item: string) => parseInt(item, 10));
      const currentVersion = getVersion(process.versions.UNITEXT_VERSION as string);

      let releaseNotes = "";

      const res = await fetch("");
      const { data } = await res.json();

      const latestVersion = getVersion(data.name);
      for (let i = 0; i < currentVersion.length; i += 1) {
        if (currentVersion[i] < latestVersion[i]) {
          releaseNotes = data;
          break;
        }
      }

      if (releaseNotes !== "") {
        this.NOTIFY({ level: "INFO", title: "有新版本" });
      }
    },
  },
});
