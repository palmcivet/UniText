import Vue from "vue";
import Vuex, { ActionContext } from "vuex";
import editor from "./modules/editor";
import general from "./modules/general";
import sideBar from "./modules/sideBar";
import notification from "./modules/notification";
import { IRootState } from "@/interface/rootStore";
import { loadSetting } from "@/common/main/utils";
import * as pkg from "@/../package.json";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    editor,
    general,
    sideBar,
    notification,
  },
  mutations: {
    /* 载入默认或自定义文件夹的设置，初始化 state */
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
    /**
     * 返回发行说明，为 `""` 则表明未更新
     */
    CHECK_UPDATE: (rootState: ActionContext<IRootState, IRootState>) => {
      const getVersion = (ver: string) =>
        ver
          .substring(1)
          .split(".")
          .map((item: string) => parseInt(item, 10));
      const currentVersion = getVersion((pkg as any).version);

      let notes = "";

      fetch("")
        .then((res) => res.json())
        .then((res) => {
          const latestVersion = getVersion(res.data.name);
          for (let i = 0; i < currentVersion.length; i += 1) {
            if (currentVersion[i] < latestVersion[i]) {
              notes = res.data;
              break;
            }
          }
        });

      if (notes !== "") {
        rootState.dispatch("");
      }
    },
  },
  strict: true,
});
