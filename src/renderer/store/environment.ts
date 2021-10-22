import { defineStore } from "pinia";

export default defineStore({
  id: "environment",

  state: () => ({
    isOsx: true,
    isWin: false,
    isLinux: false,
    isDev: true,
  }),

  getters: {},

  actions: {},
});
