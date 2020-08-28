import Vue from "vue";
import Vuex from "vuex";
import panel from "./modules/panel";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import statusBar from "./modules/statusBar";
import workBench from "./modules/workBench";
import notification from "./modules/notification";
import { ISetting } from "@/interface/bootstrap";
import { IRootState } from "@/interface/vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    panel,
    general,
    sideBar,
    statusBar,
    workBench,
    notification,
  },
  strict: true,
  mutations: {
    /**
     * 更新系统设置，初始化 state
     * @param payload 从 JSON 文件读取的设置
     */
    SYNC_SETTING: (rootState: IRootState, payload: ISetting) => {
      rootState.general.appearance = payload.appearance;
      rootState.general.editor = payload.editor;
      rootState.sideBar.files = payload.files;
      // TODO 余下设置
    },
  },
});
