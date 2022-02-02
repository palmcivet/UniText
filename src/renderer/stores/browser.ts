import { defineStore } from "pinia";
import { EBrowserType, IBrowserState } from "@/shared/typings/store";

export default defineStore({
  id: "browser",

  state: () =>
    ({
      browserType: EBrowserType.SEARCH,
      isShowBrowser: true,
    } as IBrowserState),

  getters: {},

  actions: {
    /**
     * @description 收起 browser
     */
    TOGGLE_BROWSER() {
      this.isShowBrowser = !this.isShowBrowser;
    },

    SWITCH_BROWSER(type: EBrowserType) {
      this.browserType = type;
    },
  },
});
