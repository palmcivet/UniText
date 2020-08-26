import Vue from "vue";
import VueI18n from "vue-i18n";
import VueShortkey from "vue-shortkey";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import store from "@/store/index";
import App from "@/view/Index.vue";
import { IPC_PREFERENCE } from "@/common/ipc-channel";
import { localesMessage } from "@/app/config/locales-message";
import { IBootCache } from "@/interface/bootstrap";
import { VueBus } from "./bus";
import "@/asset/styles/tailwind.css";
import "@/asset/styles/main.less";

let defaultLocale = "";

ipcRenderer.on(
  IPC_PREFERENCE.SEND,
  (event, message: { locale: string; setting: any; cache: IBootCache; error: any[] }) => {
    const { locale, setting, cache, error } = message;
    defaultLocale = locale;
    store.commit("SYNC_SETTING", setting);
  }
);
ipcRenderer.send(IPC_PREFERENCE.FETCH);

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: defaultLocale,
  messages: localesMessage as any,
  silentTranslationWarn: true,
});

Vue.use(VueShortkey);
Vue.config.productionTip = false;
Vue.prototype.$bus = VueBus;

new Vue({
  i18n,
  store,
  components: {
    App,
  },
  template: "<App></App>",
}).$mount("#app");
