import {
  IGeneralState,
  EPanelType,
  ETypeMode,
  EEditMode,
} from "@/typings/modules/general";

const getters = {};

const mutations = {
  /* TODO 合并、优化 */
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
  getters,
  mutations,
  actions,
};
