import Vue from "vue";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import { I18n } from "@/renderer/plugins/I18n";
import { VueBus } from "@/renderer/bus";
import { localesView } from "@/main/i18n/view";
import { notEmpty } from "@/common/utils";
import { IPC_BOOTSTRAP, IPC_PREFERENCE } from "@/common/channel";
import { IBootArgs, EI18n } from "@/typings/bootstrap";
import "@/renderer/styles/main.less";

ipcRenderer.once(
  IPC_BOOTSTRAP.REPLY,
  (event, msg: { lang: "ZH_CN" | "EN_US"; args: IBootArgs }) => {
    const { lang, args } = msg;

    if (notEmpty(args.error)) store.commit("SET_ERROR", args.error);
  }
);
ipcRenderer.send(IPC_BOOTSTRAP.FETCH);

// store.dispatch("CHECK_UPDATE");

store.commit("SET_STATE", {
  ...ipcRenderer.sendSync(IPC_PREFERENCE.GET_ITEM_SYNC, "editor", "appearance", "files"),
});

Vue.use(I18n, {
  lang: EI18n.ZH_CN,
  messages: localesView,
});

Vue.config.productionTip = false;
Vue.prototype.$bus = VueBus;

new Vue({
  store,
  components: {
    Main,
  },
  template: "<Main />",
}).$mount("#app");
