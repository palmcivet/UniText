import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import { remote } from "electron";
import * as fse from "fs-extra";

import { ISideBarState } from "@/typings/modules/sideBar";
import { IRootState } from "@/typings/store";
import { CONFIG_FILE } from "@/common/env";
import { FileManager } from "@/common/fileSystem/FileManager";
import { joinPath } from "@/common/fileSystem/files";

const state: ISideBarState = {
  fileManager: new FileManager(),
  activeItem: "",
  files: {
    folderDir: "",
    ignoreFile: [".DS_Store", "desktop.ini", ".CONFIG", "node_modules"],
    hideIgnore: false,
    showIndent: true,
    defaultFold: true,
  },
  marks: {},
  search: {},
  tags: {},
};

const getters: GetterTree<ISideBarState, IRootState> = {
  cacheTree: (moduleState: ISideBarState) => moduleState.fileManager.cacheTree,
  logicTree: (moduleState: ISideBarState) => moduleState.fileManager.logicTree,
};

const mutations: MutationTree<ISideBarState> = {
  SET_FOLDER: (moduleState: ISideBarState, path: string) => {
    moduleState.files.folderDir = path;
  },
  CHOOSE_ITEM: (moduleState: ISideBarState, path: string) => {
    moduleState.activeItem = path;
  },
  REVEAL_FILE: (moduleState: ISideBarState, path: string) => {},
  TOGGLE_FOLDER: (moduleState: ISideBarState, idx: number) => {
    moduleState.fileManager.toggleFolder(idx);
  },
  TOGGLE_ALL: (moduleState: ISideBarState, isOnce: boolean) => {},
  BUILD_LIST: (moduleState: ISideBarState) => {
    moduleState.fileManager.buildLogicTree();
  },
};

const actions: ActionTree<ISideBarState, IRootState> = {
  /**
   * 点击按钮，选择笔记文件夹打开
   */
  OPEN_FOLDER: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    remote.dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory", "createDirectory"],
      })
      .then((res) => {
        moduleState.commit("SET_FOLDER", res.filePaths[0] || "");
        moduleState.dispatch("BUILD_TREE");
      });
  },
  /**
   * 构建文件树
   */
  BUILD_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    moduleState.state.fileManager.buildCacheTree(
      moduleState.state.files.folderDir,
      "",
      moduleState.state.files.ignoreFile
    );
    setTimeout(() => {
      moduleState.commit("BUILD_LIST");
    }, 400);
  },
  /**
   * 加载设置中 `folderDir` 保存的 JSON 文件树
   * - 不为空，则在初始化时加载
   * - 若为空，则表明新建窗口，需要手动指定文件夹，通过 `OPEN_FOLDER()` 加载
   */
  LOAD_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    const dir = moduleState.state.files.folderDir;
    const fm = moduleState.state.fileManager;

    if (dir !== "") {
      const tree = joinPath(dir, CONFIG_FILE.TREE);
      if (fse.pathExistsSync(tree)) {
        fm.loadTree(tree).then(() => {
          // TODO check and validate
          // moduleState.commit("notification/SET_ERROR", { root: true });
          moduleState.commit("notification/SET_ERROR", fm.errReg, { root: true });
          moduleState.commit("BUILD_LIST");
        });
      } else {
        moduleState.dispatch("BUILD_TREE");
      }
    }
  },
  /**
   * 保存文件树
   */
  SAVE_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    fse
      .writeJSON(
        joinPath(moduleState.state.files.folderDir, CONFIG_FILE.TREE),
        moduleState.state.fileManager.cacheTree
      )
      .then((res) => {
        // TODO 通知
        moduleState.commit("notification/INFO", { root: true });
      })
      .catch((err) => {
        moduleState.commit("notification/SET_ERROR", err, { root: true });
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
