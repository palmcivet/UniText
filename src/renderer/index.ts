import Vue from "vue";
import "remixicon/fonts/remixicon.css";

import Main from "@/renderer/views/Main.vue";
import store from "@/renderer/vuex";
import { I18n } from "@/renderer/plugins/I18n";
import { VueBus } from "@/renderer/bus";
import { localesView } from "@/main/i18n/view";
import { EI18n } from "@/typings/bootstrap";
import "@/renderer/styles/main.less";

Vue.use(I18n, {
  lang: EI18n.ZH_CN,
  messages: localesView,
});

Vue.config.productionTip = false;
Vue.prototype.$bus = VueBus;

new Vue({
  store,
  components: {
    Main,
  },
  template: "<Main />",
}).$mount("#app");
