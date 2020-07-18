import Vue from "vue";
import Vuex from "vuex";
import editor from "./modules/editor";
import notification from "./modules/notification";
import setting from "./modules/setting";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    editor,
    notification,
    setting,
  },
  strict: process.env.NODE_ENV !== "production",
});
