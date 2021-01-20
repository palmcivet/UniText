import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import VueBus from "@/renderer/plugins/VueBus";
import VueI18n from "@/renderer/plugins/VueI18n";
import { localesView } from "@/main/i18n/view";
import { EI18n } from "@/typings/bootstrap";
import "@/renderer/styles/main.less";

Vue.use(VueBus);
Vue.use(VueI18n, {
  lang: EI18n.ZH_CN,
  messages: localesView,
});

Vue.config.productionTip = false;

new Vue({
  store,
  components: { Main },
  template: "<Main />",
}).$mount("#app");
