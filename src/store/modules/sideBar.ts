import { ITreeItem } from "@/interface/view";

export interface ISideBar {
  files: {
    folderTree: Array<ITreeItem>;
    ignoreFile: Array<string>;
  };
  marks: {};
  search: {};
  tags: {};
}

const state: ISideBar = {
  files: {
    folderTree: [],
    ignoreFile: [".DS_Store", "node_modules", "desktop.ini"],
  },
  marks: {},
  search: {},
  tags: {},
};

const getters = {};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
