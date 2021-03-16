import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import { parseUrl } from "@/common/url";
import { localesView } from "@/common/i18n/iInterface";
import Theme from "@/common/userData/Theme";
import Snippet from "@/common/userData/Snippet";
import Markdown from "@/common/userData/Markdown";
import Preference from "@/common/userData/Preference";
import Main from "@/renderer/pages/Main.vue";
import store from "@/renderer/vuex";
import VueBus from "@/renderer/plugins/VueBus";
import VueI18n from "@/renderer/plugins/VueI18n";
import VueLayout from "@/renderer/plugins/VueLayout";

import "@/renderer/styles/main.less";

const args = parseUrl();

Vue.use(VueBus);
Vue.use(VueI18n, {
  lang: args.lang,
  messages: localesView,
});
Vue.use(VueLayout, {
  setup: { sash: 2, width: 970, height: 590 },
  layout: {
    side: { width: 160, range: [150, 250], close: false },
    panel: { width: 155, range: [150, 250], close: true },
  },
});

Vue.prototype.$theme = new Theme(args.proj);
Vue.prototype.$snippet = new Snippet(args.proj);
Vue.prototype.$markdown = new Markdown(args.proj);
Vue.prototype.$preference = new Preference(args.proj);

Vue.config.productionTip = false;

new Vue({
  store,
  components: { Main },
  template: "<Main />",
}).$mount("#app");
