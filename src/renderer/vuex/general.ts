import { ActionTree, GetterTree, MutationTree } from "vuex";

import { IRootState } from "@/typings/vuex";
import { IGeneralState, EPanelType, ETypeMode, EEditMode } from "@/typings/vuex/general";
import { Bus } from "../plugins/VueBus";
import { BUS_EDITOR } from "@/common/channel";

const state = {};

const getters: GetterTree<IGeneralState, IRootState> = {};

const mutations: MutationTree<IGeneralState> = {
  /* TODO 合并、优化 */
  TOGGLE_SIDE_BAR: (moduleState: IGeneralState) => {
    moduleState.appearance.showSideBar = !moduleState.appearance.showSideBar;
  },
  TOGGLE_STATUS_BAR: (moduleState: IGeneralState) => {
    moduleState.appearance.showStatusBar = !moduleState.appearance.showStatusBar;
  },
  TOGGLE_CHECK: (moduleState: IGeneralState) => {
    Bus.emit(BUS_EDITOR.SYNC_VIEW);
    moduleState.appearance.checkEdit = !moduleState.appearance.checkEdit;
  },
  TOGGLE_PRESENT: (moduleState: IGeneralState) => {
    Bus.emit(BUS_EDITOR.SYNC_VIEW);
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

const actions: ActionTree<IGeneralState, IRootState> = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
