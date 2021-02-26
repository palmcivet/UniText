import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import { parseUrl } from "@/common/url";
import { localesView } from "@/common/i18n/iInterface";
import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import VueBus from "@/renderer/plugins/VueBus";
import VueI18n from "@/renderer/plugins/VueI18n";
import VueTheme from "@/renderer/plugins/VueTheme";
import VueMarkdown from "@/renderer/plugins/VueMarkdown";

import "@/renderer/styles/main.less";

const args = parseUrl();

Vue.use(VueBus);
Vue.use(VueI18n, {
  lang: args.lang,
  messages: localesView,
});
Vue.use(VueTheme, { base: args.conf });
Vue.use(VueMarkdown, { base: args.conf });

Vue.config.productionTip = false;

new Vue({
  store,
  components: { Main },
  template: "<Main />",
}).$mount("#app");
