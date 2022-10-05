import { createApp } from "vue";
import { createPinia } from "pinia";

import Index from "@/renderer/Index.vue";
import createModel from "@/renderer/models";
import { EWindowType } from "@/shared/typings/main";
import { i18n } from "./i18n";

import "remixicon/fonts/remixicon.css";
import "@palmcivet/unitext-tree-view/dist/style.css";
import "@/renderer/styles/main.less";

import "@/shared/themes/one-dark-pro/app-style.less";
import "@/shared/themes/one-dark-pro/article-code.less";
import "@/shared/themes/one-dark-pro/article-body.less";

async function renderer() {
  /**
   * 解析参数，传入 props，动态渲染 Pages
   * - i18n
   * - type: Main | Setting | View
   */
  if (location.pathname === `/${EWindowType.SETTING}`) {
    // 切换到 main
  }

  const app = createApp(Index, {});
  const pinia = createPinia();
  app.use(pinia);
  app.use(i18n);

  app.config.globalProperties.$t = i18n.global.t;

  // TODO 弃用
  app.config.globalProperties.$g = (options: Array<string>) => options[0];

  await createModel().invoke(app);

  app.mount("#app");
}

queueMicrotask(renderer);
