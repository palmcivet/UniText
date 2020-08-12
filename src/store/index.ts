import Vue from "vue";
import Vuex, { ActionContext } from "vuex";
import editor from "./modules/editor";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import notification from "./modules/notification";
import { IRootState } from "@/interface/rootStore";
import { loadSetting } from "@/common/main/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    editor,
    general,
    sideBar,
    notification,
  },
  mutations: {
    SYNC_SETTING: (rootState: IRootState, payload: any) => {
      console.log(payload);
    },
  },
  actions: {
    LOAD_SETTING: (rootState: ActionContext<IRootState, IRootState>, payload: any) => {
      loadSetting(payload.path).then((res) => {
        console.log(res);
      });
    },
  },
  strict: true,
});
