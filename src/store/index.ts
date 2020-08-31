import Vue from "vue";
import Vuex, { ActionContext } from "vuex";

import panel from "./modules/panel";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import statusBar from "./modules/statusBar";
import workBench from "./modules/workBench";
import notification from "./modules/notification";
import { loadSetting } from "@/common/preference";
import { IRootState } from "@/interface/vuex";
import { TStore } from "@/interface/bootstrap";

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
     * electron-store 读取/初始化得到的结构，存入 Vuex，此后使用 `.store`/`.get`/`.set` 读取或设置
     * @param setting 存储结构
     */
    SYNC_SETTING: (rootState: IRootState, setting: TStore) => {
      rootState.general.setting = setting;
      /* 初始化 state */
      const { appearance, editor, files } = setting.store;
      rootState.general.appearance = appearance;
      rootState.general.editor = editor;
      rootState.sideBar.files = files;
      // TODO 解析余下设置
    },
  },
  actions: {
    /**
     * 加载、校验笔记文件夹的设置文件
     */
    LOAD_SETTING: (
      rootState: ActionContext<IRootState, IRootState>,
      path: string = rootState.state.sideBar.files.folderDir
    ) => {
      const setting = loadSetting(path);
      rootState.commit("SYNC_SETTING", setting);
      /* 以下为初始化工作 */
      rootState.dispatch("sideBar/LOAD_TREE");
      // moduleState.dispatch("general/CHECK_UPDATE");
    },
  },
});
