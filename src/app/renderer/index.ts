/* eslint-disable import/no-unresolved */
import Vue from "vue";
import moment from "moment";
import Antd from "ant-design-vue";
import VueI18n from "vue-i18n";
import Prism from "prismjs";
import VueShortkey from "vue-shortkey";
import { ipcRenderer } from "electron";
import { required } from "vee-validate/dist/rules";
import { extend } from "vee-validate";
import "remixicon/fonts/remixicon.css";

import App from "@/views/Index.vue";
import store from "@/store/index";
import { PREFERENCE } from "@/helpers/ipcChannel";
import { localesMessage } from "@/app/config/locales-message";
import { router } from "./router";
import { VueBus } from "./bus";
import "@/assets/styles/tailwind.css";
import "@/assets/styles/main.less";

let defaultLocale = "";
let defaultConfig = {};

// 与 main 进程通信获取数据
ipcRenderer.send(PREFERENCE.SEND, (locale: string, config: any) => {
  defaultLocale = locale;
  defaultConfig = config;
});

// TODO 根据设置初始化 state
// store.state.editor = defaultConfig.editor.layout;

// i18n 设置语言
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: defaultLocale,
  messages: localesMessage as any,
  silentTranslationWarn: true,
});

// 表单验证
extend("required", {
  ...required,
  message: "此项是必填项",
});

Prism.highlightAll();

Vue.use(Antd);
Vue.use(VueBus);
Vue.use(VueShortkey);
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  mounted() {
    router.push("/");
  },
}).$mount("#app");
