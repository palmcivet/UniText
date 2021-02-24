import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import { localesView } from "@/main/i18n/iInterface";
import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import VueBus from "@/renderer/plugins/VueBus";
import VueI18n from "@/renderer/plugins/VueI18n";
import VueTheme from "@/renderer/plugins/VueTheme";
import VueMarkdown from "@/renderer/plugins/VueMarkdown";
import { EI18n } from "@/typings/schema/preference";

import "@/renderer/styles/main.less";

Vue.use(VueBus);
Vue.use(VueI18n, {
  lang: EI18n.ZH_CN,
  messages: localesView,
});
Vue.use(VueTheme);
Vue.use(VueMarkdown);

Vue.config.productionTip = false;

new Vue({
  store,
  components: { Main },
  template: "<Main />",
}).$mount("#app");
