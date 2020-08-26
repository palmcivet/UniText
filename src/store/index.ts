import Vue from "vue";
import Vuex, { ActionContext } from "vuex";
import panel from "./modules/panel";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import workBench from "./modules/workBench";
import notification from "./modules/notification";
import { IRootState } from "@/interface/rootStore";
import { loadSetting } from "@/common/main/utils";
import { IGeneralState } from "@/interface/vuex/general";
import * as pkg from "@/../package.json";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    panel,
    general,
    sideBar,
    workBench,
    notification,
  },
  mutations: {
    /* 更新系统设置，初始化 state */
    SYNC_SETTING: (rootState: IRootState, payload: any) => {
      const state = Object.keys(rootState.general);
      state.forEach((group) => {
        rootState.general[group as keyof IGeneralState] = payload[group];
      });
      // TODO 余下设置
    },
  },
  actions: {
    /**
     * 加载、校验笔记文件夹的设置文件
     * @param path 指定笔记文件夹路径
     */
    LOAD_SETTING: (rootState: ActionContext<IRootState, IRootState>, path: string) => {
      loadSetting(path).then((res) => {
        if (!res[1]) {
          // TODO 报错
          console.error(res);
          return;
        }
        rootState.commit("SYNC_SETTING", res[0]);
      });
    },
    /**
     * 保存笔记文件夹的设置
     */
    SAVE_SETTING: (rootState: ActionContext<IRootState, IRootState>) => {},
    /**
     * 获取发行说明，`""` 则表明未更新
     */
    CHECK_UPDATE: (rootState: ActionContext<IRootState, IRootState>) => {
      const getVersion = (ver: string) =>
        ver
          .substring(1)
          .split(".")
          .map((item: string) => parseInt(item, 10));
      const currentVersion = getVersion((pkg as any).version);

      let releaseNotes = "";

      fetch("")
        .then((res) => res.json())
        .then((res) => {
          const latestVersion = getVersion(res.data.name);
          for (let i = 0; i < currentVersion.length; i += 1) {
            if (currentVersion[i] < latestVersion[i]) {
              releaseNotes = res.data;
              break;
            }
          }
        });

      if (releaseNotes !== "") {
        rootState.dispatch("");
      }
    },
  },
  strict: true,
});
