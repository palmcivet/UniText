import { IGeneralState, EPanelShow, EPanelType, ETypingMode } from "@/interface/general";

const state: IGeneralState = {
  showTray: true,
  exitWhenClosed: false,
  saveRecent: true,
  autoOpen: true,
  autoUpdate: true,
  language: "zh-CN",
  notesPath: "~/.unitext",
  interface: {
    showPanel: EPanelShow.side,
    panelType: EPanelType.toc,
    showSideBar: true,
    showRender: false,
    typeMode: ETypingMode.single,
    zenMode: false,
  },
  editor: {
    lineNumber: true,
    highlightLine: true,
  },
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
