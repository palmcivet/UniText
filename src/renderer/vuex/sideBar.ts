import { remote } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { hasKeys, notEmpty } from "@/common/utils";
import { buildTree } from "@/common/fileSystem";
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
};

const getters: GetterTree<ISideBarState, IRootState> = {
  isEmptyFolder: (_: ISideBarState) => {
    return !hasKeys(_.fileTree);
  },
};

const mutations: MutationTree<ISideBarState> = {
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
      // NOTE 完善报错信息
      commit("information/SET_ERROR", "", { root: true });
    } else {
      // FEAT 提示是否初始化、作为默认文件夹
      commit("general/SET_FOLDER", res.filePaths[0], { root: true });
      dispatch("sideBar/BUILD_TREE");
      dispatch("LOAD_STATE");
    }
  },

  CLOSE_PROJECT: async (_: ActionContext<ISideBarState, IRootState>) => {},
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
