import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import { parseURL } from "@/shared/url";
import Preference from "@/renderer/services/PreferenceService";
import Markdown from "@/renderer/services/MarkdownService";
import Snippet from "@/renderer/services/SnippetService";
import Theme from "@/renderer/services/ThemeService";
import { localesView } from "@/shared/i18n/ZH_CN";
import Main from "@/renderer/pages/Main.vue";
import store from "@/renderer/vuex";
import VueBus from "@/renderer/plugins/VueBus";
import VueI18n from "@/renderer/plugins/VueI18n";
import VueLayout from "@/renderer/plugins/VueLayout";

import "@/renderer/styles/main.less";

const args = parseURL();
const pref = new Preference(args.proj);

Vue.config.productionTip = false;

Vue.prototype.$preference = pref;
Vue.prototype.$markdown = new Markdown(args.proj);
Vue.prototype.$snippet = new Snippet(args.proj);
Vue.prototype.$theme = new Theme(args.proj);

Vue.use(VueBus);
Vue.use(VueI18n, {
  lang: args.lang,
  messages: localesView,
});
Vue.use(VueLayout, {
  setup: { width: 970, height: 590 },
  layout: {
    side: {
      range: [150, 250],
      isClose: !pref.getItem("interface.showSideBar"),
      mainPart: 160,
    },
    panel: {
      range: [150, 250],
      isClose: !pref.getItem("interface.showPanel"),
      mainPart: 155,
    },
  },
});

new Vue({
  store,
  components: { Main },
  template: "<Main />",
}).$mount("#app");
