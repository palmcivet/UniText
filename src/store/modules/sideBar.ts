import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import { remote } from "electron";
import * as fse from "fs-extra";

import { ISideBarState, ITree, ITreeItem } from "@/interface/vuex/modules/sideBar";
import { IRootState } from "@/interface/vuex/index";
import { CONFIG_FILE } from "@/common/env";
import { joinPath } from "@/common/main/files";

const state: ISideBarState = {
  folderTree: {},
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

const buildTree = async (
  fileTree: ITree,
  base: string,
  path: string,
  ignore: string[]
) => {
  const res = await fse.readdir(joinPath(base, path));

  res.forEach((item, idx) => {
    if (ignore.indexOf(item) !== -1) return;
    const isDir = fse.lstatSync(joinPath(base, path, item)).isDirectory();
    const subPath = joinPath(path, item);
    const subTree = {
      order: idx,
      icon: isDir ? "folder" : "file",
      fold: true,
      path: subPath,
      file: {},
    };
    fileTree[item] = subTree;
    if (isDir) {
      return buildTree(subTree.file, base, subPath, ignore);
    }
  });
};

const getters: GetterTree<ISideBarState, IRootState> = {};

const mutations: MutationTree<ISideBarState> = {
  SET_FOLDER: (moduleState: ISideBarState, path: string) => {
    moduleState.files.folderDir = path;
  },
  SET_TREE: (moduleState: ISideBarState, tree: ITree) => {
    moduleState.folderTree = tree;
  },
  REVEAL_FILE: (moduleState: ISideBarState, path: string) => {
    let p = moduleState.folderTree;
    path.split("/").forEach((i) => {
      p[i].fold = false;
      p = p[i].file;
    });
  },
  TOGGLE_FOLDER: (moduleState: ISideBarState, path: string) => {
    let p = moduleState.folderTree;
    let r!: ITreeItem;
    path.split("/").forEach((i) => {
      r = p[i];
      p = p[i].file;
    });
    r.fold = !r.fold;
  },
  TOGGLE_ALL: (moduleState: ISideBarState, isOnce: boolean) => {
    let t = moduleState.folderTree;
    if (isOnce) {
      for (const f in t) {
        t[f].fold = true;
      }
    } else {
      // TODO traverse
    }
  },
};

const actions: ActionTree<ISideBarState, IRootState> = {
  /**
   * 选择笔记文件夹打开
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
    const fileTree: ITree = {};
    buildTree(
      fileTree,
      moduleState.state.files.folderDir,
      "",
      moduleState.state.files.ignoreFile
    ).then(() => {
      setTimeout(() => {
        moduleState.commit("SET_TREE", fileTree);
      }, 200);
    });
  },
  /**
   * 加载设置中 `folderDir` 保存的文件树
   * - 不为空，则在初始化时加载
   * - 若为空，则表明新建窗口，需要手动指定文件夹，通过 `OPEN_FOLDER()` 加载
   */
  LOAD_TREE: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    const dir = moduleState.state.files.folderDir;

    if (dir !== "") {
      const tree = joinPath(dir, CONFIG_FILE.TREE);
      if (fse.pathExistsSync(tree)) {
        fse
          .readJSON(tree)
          .then((res) => {
            // TODO check and validate
            // moduleState.commit("notification/SET_ERROR", { root: true });
            moduleState.commit("SET_TREE", res);
          })
          .catch((err) => {
            moduleState.commit("notification/SET_ERROR", err, { root: true });
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
        moduleState.state.folderTree
      )
      .then((res) => {
        // TODO 通知
        moduleState.dispatch("");
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
