import { createApp } from "vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";

import Index from "@/renderer/Index.vue";
import createModel from "@/renderer/models";
import { EWindowType } from "@/shared/typings/main";

import "remixicon/fonts/remixicon.css";
import "@palmcivet/unitext-tree-view/dist/style.css";
import "@/renderer/styles/main.less";
import { useService } from "./composables";

async function renderer() {
  /**
   * 解析参数，传入 props，动态渲染 Pages
   * - i18n
   * - type: Main | Setting | View
   */
  if (location.pathname === `/${EWindowType.SETTING}`) {
    // 切换到 main
  }

  /* ì18n begin */

  const messages = await useService("LanguageService").getLocaleMessages();

  const i18n = createI18n({
    legacy: false,
    locale: "zh-CN",
    messages,
  });

  /* ì18n end */

  const app = createApp(Index, {});
  app.use(createPinia());
  app.use(i18n);

  app.config.globalProperties.$t = i18n.global.t;

  // TODO 弃用
  app.config.globalProperties.$g = (options: Array<string>) => options[0];

  await createModel().invoke(app);

  app.mount("#app");
}

queueMicrotask(renderer);
