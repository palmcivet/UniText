import { defineStore } from "pinia";

import { IEnvironmentState } from "@/shared/typings/store";

export default defineStore({
  id: "environment",

  state: () =>
    ({
      platform: "darwin",
      isDev: true,
    } as IEnvironmentState),

  getters: {
    isOsx(_) {
      return _.platform === "darwin";
    },

    isWin(_) {
      return _.platform === "win32";
    },

    isLinux(_) {
      return _.platform === "linux";
    },
  },

  actions: {
    FILL_STORE(state: IEnvironmentState) {
      this.$state = state;
    },
  },
});
