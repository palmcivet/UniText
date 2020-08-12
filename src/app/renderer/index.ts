import Vue from "vue";
import Antd from "ant-design-vue";
import VueI18n from "vue-i18n";
import VueShortkey from "vue-shortkey";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import store from "@/store/index";
import App from "@/view/Index.vue";
import { IPC_PREFERENCE } from "@/common/ipcChannel";
import { localesMessage } from "@/app/config/locales-message";
import { IBootCache } from "@/interface/boot";
import { VueBus } from "./bus";
import "@/asset/styles/tailwind.css";
import "@/asset/styles/main.less";

let defaultLocale = "";

// 与 main 进程通信获取数据
ipcRenderer.send(IPC_PREFERENCE.FETCH);
ipcRenderer.on(
  IPC_PREFERENCE.SEND,
  (event, message: { locale: string; setting: any; cache: IBootCache; error: any[] }) => {
    const { locale, setting, cache, error } = message;
    defaultLocale = locale;
    /* 载入默认或自定义文件夹的设置，初始化 state */
    store.commit("SYNC_SETTING", setting);
  }
);

// i18n 设置语言
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: defaultLocale,
  messages: localesMessage as any,
  silentTranslationWarn: true,
});

Vue.use(Antd);
Vue.use(VueShortkey);
Vue.config.productionTip = false;
Vue.prototype.$bus = VueBus;

new Vue({
  store,
  i18n,
  components: {
    App,
  },
  template: "<App></App>",
}).$mount("#app");
