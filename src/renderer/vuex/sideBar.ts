import { remote } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import * as fse from "fs-extra";

import { hasKeys, notEmpty } from "@/common/utils";
import { CONFIG_FILE } from "@/common/env";
import { buildTree, joinPath } from "@/common/fileSystem";
import { IRootState } from "@/typings/vuex";
import { ISideBarState, ITree, ITreeNode, TFileRoute } from "@/typings/vuex/sideBar";

const state: ISideBarState = {
  activeItem: "",
  fileTree: {},
  filesState: {
    folderDir: "",
    ignoreFile: [],
    hideIgnore: false,
    showIndent: false,
  },
  marksState: {},
  searchState: {},
  tagsState: {},
};

const getters: GetterTree<ISideBarState, IRootState> = {
  isEmptyFolder: (_: ISideBarState) => {
    return !hasKeys(_.fileTree);
  },
};

const mutations: MutationTree<ISideBarState> = {
  SET_FOLDER: (_: ISideBarState, path: string) => {
    _.filesState.folderDir = path;
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
   * 点击按钮，选择笔记文件夹打开
   */
  OPEN_PROJECT: async (_: ActionContext<ISideBarState, IRootState>) => {
    const { commit, dispatch } = _;

    const res = await remote.dialog.showOpenDialog({
      // FEAT i18n
      title: "打开项目文件夹",
      properties: ["openDirectory", "createDirectory", "showHiddenFiles"],
    });

    if (notEmpty(res.filePaths)) {
      // TODO 完善报错信息
      commit("information/SET_ERROR", "", { root: true });
    } else {
      commit("SET_FOLDER", res.filePaths[0]);
      dispatch("BUILD_TREE");
    }
  },

  /**
   * 构建文件树
   */
  BUILD_TREE: (_: ActionContext<ISideBarState, IRootState>) => {
    const targetTree: ITree = {};
    buildTree(
      _.state.filesState.folderDir,
      "",
      _.state.filesState.ignoreFile,
      targetTree
    );
    setTimeout(() => {
      _.state.fileTree = targetTree;
    }, 400);
  },

  /**
   * 加载文件树
   * - 不为空，则在初始化时加载
   * - 若为空，则表明新建窗口，不需要操作
   */
  LOAD_TREE: async (_: ActionContext<ISideBarState, IRootState>) => {
    const { dispatch, state } = _;
    if (state.filesState.folderDir === "") return;
    dispatch("BUILD_TREE");
  },

  CHECK_TREE: (_: ActionContext<ISideBarState, IRootState>) => {},
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
