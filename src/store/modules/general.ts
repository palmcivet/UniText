/**
 * @file 本模块统筹管理配置项，其余模块获取配置信息、管理运行时数据
 */

import {
  IGeneralState,
  EPanelStyle,
  EPanelType,
  ETypeMode,
  EViewMode,
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
    language: "zh-CN",
  },
  appearance: {
    showSideBar: true,
    showStatusBar: true,
    showPanel: true,
    panelStyle: EPanelStyle.SIDE,
    panelType: EPanelType.TOC,
    viewMode: EViewMode.CONTRAST,
    typeMode: ETypeMode.NORMAL,
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

const mutations = {
  TOGGLE_SIDE_BAR: (moduleState: IGeneralState) => {
    moduleState.appearance.showSideBar = !moduleState.appearance.showSideBar;
  },
  TOGGLE_STATUS_BAR: (moduleState: IGeneralState) => {
    moduleState.appearance.showStatusBar = !moduleState.appearance.showStatusBar;
  },
  TOGGLE_PANEL: (moduleState: IGeneralState) => {
    moduleState.appearance.showPanel = !moduleState.appearance.showPanel;
  },
  SWITCH_PANEL_TYPE: (moduleState: IGeneralState, type: EPanelType) => {
    moduleState.appearance.panelType = type;
  },
  SET_TYPE_MODE: (moduleState: IGeneralState, mode: ETypeMode) => {
    moduleState.appearance.typeMode = mode;
  },
  SET_VIEW_MODE: (moduleState: IGeneralState, mode: EViewMode) => {
    moduleState.appearance.viewMode = mode;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
