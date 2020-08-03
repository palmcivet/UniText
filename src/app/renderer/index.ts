import Vue from "vue";
import Antd from "ant-design-vue";
import VueI18n from "vue-i18n";
import VueShortkey from "vue-shortkey";
import { ipcRenderer } from "electron";
import "remixicon/fonts/remixicon.css";

import store from "@/store/index";
import { PREFERENCE } from "@/common/ipcChannel";
import { localesMessage } from "@/app/config/locales-message";
import { router } from "./router";
import { VueBus } from "./bus";
import "@/asset/styles/tailwind.css";
import "@/asset/styles/main.less";

let defaultLocale = "";
let defaultConfig = {};

// 与 main 进程通信获取数据
ipcRenderer.send(PREFERENCE.SEND, (locale: string, config: any) => {
  defaultLocale = locale;
  defaultConfig = config;
});

// TODO 根据设置初始化 state

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
  router,
  store,
  i18n,
  template: "<router-view></router-view>",
  mounted() {
    router.push("/");
  },
}).$mount("#app");
