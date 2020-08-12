import {
  IGeneralState,
  EPanelShow,
  EPanelType,
  ETypingMode,
} from "@/interface/vuex/general";
import { EEol } from "@/interface/document";

const state: IGeneralState = {
  showTray: true,
  exitWhenClosed: false,
  saveRecent: true,
  autoOpen: true,
  autoUpdate: true,
  language: "zh-CN",
  notesPath: "",
  interface: {
    showSideBar: true,
    showRender: false,
    panelShow: EPanelShow.side,
    panelType: EPanelType.toc,
    typingMode: ETypingMode.source,
    zenMode: false,
  },
  editor: {
    defaultDoc: {
      tag: "Untaged",
      category: "Uncategory",
      format: {
        indent: 4,
        encoding: "UTF-8",
        endOfLine: EEol.LF,
      },
      config: {
        picStorage: "",
        autoSave: false,
        autoSync: false,
        complete: false,
      },
    },
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
