/**
 * @file 本模块统筹管理配置项，其余模块获取配置信息、管理运行时数据
 */

import {
  IGeneralState,
  EPanelShow,
  EPanelType,
  ETypingMode,
} from "@/interface/vuex/general";
import { EEol } from "@/interface/document";

const state: IGeneralState = {
  system: {
    showTray: true,
    exitWhenClosed: false,
    saveRecent: true,
    autoOpen: true,
    autoUpdate: true,
    notesPath: "",
  },
  appearance: {
    language: "zh-CN",
    showSideBar: true,
    showPreview: false,
    showPanel: EPanelShow.side,
    panelType: EPanelType.toc,
    typingMode: ETypingMode.source,
    zenMode: false,
  },
  editor: {
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
    },
    miniMap: false,
    wordWrap: false,
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
