import { ISideBarState } from "@/interface/vuex/sideBar";

const state: ISideBarState = {
  files: {
    folderTree: [],
    ignoreFile: [".DS_Store", "desktop.ini", ".CONFIG", "node_modules"],
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
