import { ISideBarState } from "@/interface/vuex/sideBar";

const state: ISideBarState = {
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
