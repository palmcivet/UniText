import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import { localesView } from "@/main/i18n/iInterface";
import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import VueBus from "@/renderer/plugins/VueBus";
import VueI18n from "@/renderer/plugins/VueI18n";
import { EI18n } from "@/typings/service/preference";

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
