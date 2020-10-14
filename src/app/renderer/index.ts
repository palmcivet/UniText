import Vue from "vue";
import VueI18n from "vue-i18n";
import VueShortkey from "vue-shortkey";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import store from "@/store/index";
import Main from "@/view/Main.vue";
import { localesMessage } from "@/app/i18n/message";
import { IPC_BOOTSTRAP, IPC_PREFERENCE } from "@/common/channel";
import { notEmpty } from "@/common/utils";
import { IBootArgs } from "@/typings/bootstrap";
import { VueBus } from "./bus";
import "@/styles/main.less";

let defaultLocale = "";

store.commit(
  "SET_STATE",
  ipcRenderer.sendSync(IPC_PREFERENCE.GET_ITEM_SYNC, "appearance", "editor", "files")
);

ipcRenderer.once(
  IPC_BOOTSTRAP.REPLY,
  (event, message: { locale: string; args: IBootArgs }) => {
    const { locale, args } = message;
    defaultLocale = locale;

    // store.dispatch("CHECK_UPDATE");
    if (notEmpty(args.error)) store.commit("notification/SET_ERROR", args.error);
  }
);
ipcRenderer.send(IPC_BOOTSTRAP.FETCH);

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: defaultLocale,
  messages: localesMessage,
  silentTranslationWarn: true,
});

Vue.use(VueShortkey);
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
