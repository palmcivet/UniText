import { remote } from "electron";
import * as fse from "fs-extra";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";
import { ISideBarState, ITree, ITreeItem } from "@/interface/vuex/sideBar";
import { IRootState } from "@/interface/rootStore";
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
  OPEN_FOLDER: (moduleState: ActionContext<ISideBarState, IRootState>) => {
    remote.dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory", "createDirectory"],
      })
      .then((res) => {
        moduleState.commit("SET_FOLDER", res.filePaths[0] || "");
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
      });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
