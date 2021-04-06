import * as fse from "fs-extra";
import { ipcRenderer, remote } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import { join } from "path";

import { CONFIG_FILE } from "@/common/env";
import { hasKeys, notEmpty } from "@/common/utils";
import { buildTree } from "@/common/fileSystem/fileState";
import { IPC_FILE } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import {
  ITree,
  ITreeNode,
  TFileRoute,
  ISideBarState,
  EActivityType,
} from "@/typings/vuex/sideBar";

const state: ISideBarState = {
  activity: EActivityType.FILES,
  activeItem: "",
  fileTree: {},
  markList: [],
};

const getters: GetterTree<ISideBarState, IRootState> = {
  isEmptyFolder: (_: ISideBarState) => {
    return !hasKeys(_.fileTree);
  },

  isEmptyMarks: (_: ISideBarState) => {
    return !notEmpty(_.markList);
  },
};

const mutations: MutationTree<ISideBarState> = {
  LOAD_MARKLIST: (_: ISideBarState, base: string) => {
    const absPath = join(base, ...CONFIG_FILE.MARK);

    if (!fse.existsSync(absPath)) {
      return;
    }
    _.markList = fse.readJSONSync(absPath);
  },

  OPEN_FILE: (_: ISideBarState, type: EActivityType) => {
    _.activity = type;
  },

  CHOOSE_ACTIVITY: (_: ISideBarState, type: EActivityType) => {
    _.activity = type;
  },

  CHOOSE_ITEM: (_: ISideBarState, path: string) => {
    _.activeItem = path;
  },

  REVEAL_FILE: (_: ISideBarState, path: string) => {},

  TOGGLE_FOLDER: (_: ISideBarState, route: TFileRoute) => {
    let point = _.fileTree;
    let target!: ITreeNode;
    route.forEach((key) => {
      target = point[key];
      point = point[key].children as ITree;
    });
    target.collapse = !target.collapse;
  },

  TOGGLE_ALL: (_: ISideBarState, isOnce: boolean) => {
    if (isOnce) {
      Object.values(_.fileTree).forEach((item) => {
        item.collapse = true;
      });
    } else {
      // FEAT 递归收起
    }
  },
};

const actions: ActionTree<ISideBarState, IRootState> = {
  /**
   * 构建文件树
   */
  BUILD_TREE: (_: ActionContext<ISideBarState, IRootState>) => {
    const { folderDir, ignoreFile } = _.rootState.general.fileManager;
    const targetTree: ITree = {};
    buildTree(folderDir, "", ignoreFile, targetTree);
    setTimeout(() => {
      _.state.fileTree = targetTree;
    }, 400);
  },
  /**
   * 点击按钮，选择笔记文件夹打开
   */
  OPEN_PROJECT: async (_: ActionContext<ISideBarState, IRootState>) => {
    const { commit, dispatch } = _;

    // TODO 弃用 remote
    const res = await remote.dialog.showOpenDialog({
      // FEAT i18n
      title: "打开项目文件夹",
      properties: ["openDirectory", "createDirectory", "showHiddenFiles"],
    });

    if (!notEmpty(res.filePaths)) {
      commit("notification/NOTIFY", { level: "ERROR", title: "未选择" }, { root: true });
    } else {
      // FEAT 提示是否初始化、作为默认文件夹
      commit("general/SET_FOLDER", res.filePaths[0], { root: true });
      dispatch("sideBar/BUILD_TREE");
      // FEAT 加载设置文件
    }
  },

  CLOSE_PROJECT: async (_: ActionContext<ISideBarState, IRootState>) => {},

  LISTEN_FOR_SIDEBAR: async (_: ActionContext<ISideBarState, IRootState>) => {
    ipcRenderer.on(IPC_FILE.MARK_ADD, (e, path: TFileRoute) => {
      _.state.markList.push({ path, time: new Date().toDateString(), line: 0 });
    });

    ipcRenderer.on(IPC_FILE.MARK_DEL, (e, mode: boolean) => {});
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
