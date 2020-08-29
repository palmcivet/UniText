import Vue from "vue";
import VueI18n from "vue-i18n";
import VueShortkey from "vue-shortkey";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import store from "@/store/index";
import App from "@/view/Index.vue";
import { localesMessage } from "@/app/config/locales-message";
import { IPC_BOOTSTRAP } from "@/common/ipc-channel";
import { IBootArgs } from "@/interface/bootstrap";
import { VueBus } from "./bus";
import "@/asset/styles/tailwind.css";
import "@/asset/styles/main.less";

let defaultLocale = "";

ipcRenderer.on(
  IPC_BOOTSTRAP.DATA_REPLY,
  (event, message: { locale: string; args: IBootArgs }) => {
    const { locale, args } = message;
    defaultLocale = locale;
    args.error.length && store.commit("notification/SET_ERROR", args.error);
    store.dispatch("LOAD_SETTING", args.notesPath);
  }
);
ipcRenderer.send(IPC_BOOTSTRAP.DATA_FETCH);

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
