import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";

import router from "@/renderer/router";
import { EWindowType, IWindowArgs } from "@/typings/main";
import { localesView, localesMenu } from "@/shared/i18n/ZH_CN";
import VueBus from "./plugins/VueBus";
import Index from "./index.vue";

import "remixicon/fonts/remixicon.css";
import "@/renderer/styles/main.less";

const messages = {
  "zh-CN": { ...localesView, ...localesMenu },
};

const args = ((): IWindowArgs => {
  const params = new URLSearchParams(window.location.search);

  return {
    wid: Number(params.get("wid")),
    lang: Number(params.get("lang")),
    type: Number(params.get("type")),
    proj: params.get("proj") as string,
  };
})();

const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  messages,
});

const app = createApp(Index);
app.use(createPinia()).use(router).use(i18n).use(VueBus).mount("#app");

app.config.globalProperties.$t = i18n.global.t;

if (args.type === EWindowType.NORMAL) {
  // 切换到 `/main`
}
