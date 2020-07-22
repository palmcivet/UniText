import Vue from "vue";
import Vuex from "vuex";
import general from "./modules/general";
import editor from "./modules/editor";
import notification from "./modules/notification";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    general,
    editor,
    notification,
  },
  strict: process.env.NODE_ENV !== "production",
});
