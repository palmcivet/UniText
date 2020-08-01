import Vue from "vue";
import Vuex from "vuex";
import editor from "./modules/editor";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import notification from "./modules/notification";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    editor,
    general,
    sideBar,
    notification,
  },
  strict: process.env.NODE_ENV !== "production",
});
