import Vue from "vue";
import VueI18n from "vue-i18n";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import { localesView } from "@/main/i18n/view";
import { notEmpty } from "@/common/utils";
import { IPC_BOOTSTRAP, IPC_PREFERENCE } from "@/common/channel";
import { IBootArgs, EI18n } from "@/typings/bootstrap";
import { VueBus } from "./bus";
import "@/renderer/styles/main.less";

let defaultLocale = "";

store.commit(
  "SET_STATE",
  ipcRenderer.sendSync(IPC_PREFERENCE.GET_ITEM_SYNC, "appearance", "editor", "files")
);

ipcRenderer.once(
  IPC_BOOTSTRAP.REPLY,
  (event, message: { lang: EI18n; args: IBootArgs }) => {
    const { lang, args } = message;
    defaultLocale = EI18n[lang];

    // store.dispatch("CHECK_UPDATE");
    if (notEmpty(args.error)) store.commit("SET_ERROR", args.error);
  }
);
ipcRenderer.send(IPC_BOOTSTRAP.FETCH);

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: defaultLocale,
  messages: localesView,
  silentTranslationWarn: true,
});

Vue.config.productionTip = false;
Vue.prototype.$bus = VueBus;

new Vue({
  i18n,
  store,
  components: {
    Main,
  },
  template: "<Main></Main>",
}).$mount("#app");
