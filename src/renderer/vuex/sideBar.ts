import { remote } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import * as fse from "fs-extra";

import { hasKeys } from "@/common/utils";
import { CONFIG_FILE } from "@/common/env";
import { buildTree, joinPath } from "@/common/fileSystem";
import { ISideBarState, ITree, ITreeNode, TFileRoute } from "@/typings/vuex/sideBar";
import { IRootState } from "@/typings/vuex";

const state: ISideBarState = {
  activeItem: "",
  fileTree: {},
  filesState: {
    folderDir: "",
    ignoreFile: [],
    hideIgnore: false,
    showIndent: false,
    defaultFold: false,
  },
  marksState: {},
  searchState: {},
  tagsState: {},
};

const getters: GetterTree<ISideBarState, IRootState> = {
  isEmptyFolder: (moduleState: ISideBarState) => {
    return !hasKeys(moduleState.fileTree);
  },
};

const mutations: MutationTree<ISideBarState> = {
  SET_FOLDER: (moduleState: ISideBarState, path: string) => {
    moduleState.filesState.folderDir = path;
  },
  CHOOSE_ITEM: (moduleState: ISideBarState, path: string) => {
    moduleState.activeItem = path;
  },
  REVEAL_FILE: (moduleState: ISideBarState, path: string) => {},
  TOGGLE_FOLDER: (moduleState: ISideBarState, route: TFileRoute) => {
    let point = moduleState.fileTree;
    let target!: ITreeNode;
    route.forEach((key) => {
      target = point[key];
      point = point[key].children as ITree;
    });
    target.collapse = !target.collapse;
  },
  TOGGLE_ALL: (moduleState: ISideBarState, isOnce: boolean) => {
    if (isOnce) {
      Object.values(moduleState.fileTree).forEach((item) => {
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
  OPEN_PROJECT: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    remote.dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory", "createDirectory"],
      })
      .then((res) => {
        if (res.filePaths[0] === "") {
          moduleState.commit("information/SET_ERROR", "", { root: true });
        } else {
          moduleState.commit("SET_FOLDER", res.filePaths[0]);
          moduleState.dispatch("BUILD_TREE");
        }
      });
  },
  /**
   * 构建文件树
   */
  BUILD_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    const targetTree: ITree = {};
    buildTree(
      moduleState.state.filesState.folderDir,
      "",
      moduleState.state.filesState.ignoreFile,
      targetTree
    );
    setTimeout(() => {
      moduleState.state.fileTree = targetTree;
    }, 400);
  },
  /**
   * 加载文件树
   * - 不为空，则在初始化时加载
   * - 若为空，则表明新建窗口，不需要操作
   */
  LOAD_TREE: async (moduleState: ActionContext<ISideBarState, IRootState>) => {
    const dir = moduleState.state.filesState.folderDir;
    if (dir === "") return;

    const treeJSON = joinPath(dir, CONFIG_FILE.TREE);
    if (fse.pathExistsSync(treeJSON)) {
      fse
        .readJSON(treeJSON)
        .then((res) => {
          moduleState.state.fileTree = res;
          moduleState.dispatch("CHECK_TREE");
        })
        .catch((err) => {
          moduleState.commit("information/SET_ERROR", err, { root: true });
        });
    } else {
      moduleState.dispatch("BUILD_TREE");
    }
  },
  /**
   * 保存文件树
   */
  SAVE_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    fse
      .writeJSON(
        joinPath(moduleState.state.filesState.folderDir, CONFIG_FILE.TREE),
        moduleState.state.fileTree
      )
      .catch((err) => {
        moduleState.commit("information/SET_ERROR", err, { root: true });
      });
  },
  CHECK_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {},
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
