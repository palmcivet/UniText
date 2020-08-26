/**
 * @file 本模块统筹管理配置项，其余模块获取配置信息、管理运行时数据
 */

import {
  IGeneralState,
  EPanelType,
  ETypeMode,
  EEditMode,
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
    language: "en-US",
  },
  appearance: {
    showSideBar: true,
    showStatusBar: true,
    showPanel: true,
    checkEdit: false,
    checkPresent: false,
    panelFloat: true,
    panelType: EPanelType.TOC,
    editMode: EEditMode.SOURCE,
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
  TOGGLE_CHECK: (moduleState: IGeneralState) => {
    moduleState.appearance.checkEdit = !moduleState.appearance.checkEdit;
  },
  TOGGLE_PRESENT: (moduleState: IGeneralState) => {
    moduleState.appearance.checkPresent = !moduleState.appearance.checkPresent;
  },
  TOGGLE_PANEL: (moduleState: IGeneralState) => {
    moduleState.appearance.showPanel = !moduleState.appearance.showPanel;
  },
  TOGGLE_PANEL_STYLE: (moduleState: IGeneralState) => {
    moduleState.appearance.panelFloat = !moduleState.appearance.panelFloat;
  },
  SET_PANEL_TYPE: (moduleState: IGeneralState, type: EPanelType) => {
    moduleState.appearance.panelType = type;
  },
  SET_TYPE_MODE: (moduleState: IGeneralState, mode: ETypeMode) => {
    moduleState.appearance.typeMode = mode;
  },
  SET_EDIT_MODE: (moduleState: IGeneralState, mode: EEditMode) => {
    moduleState.appearance.editMode = mode;
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
