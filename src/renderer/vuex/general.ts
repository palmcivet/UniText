import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { IPC_OTHER } from "@/common/channel/ipc";
import { IRootState } from "@/typings/vuex";
import { IGeneralState, EPanelType, ETypeMode, EEditMode } from "@/typings/vuex/general";

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
    moduleState.appearance.dbColumn = !moduleState.appearance.dbColumn;
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
  SET_READ_MODE: (moduleState: IGeneralState, mode: boolean) => {
    moduleState.appearance.readMode = mode;
  },
  SET_TYPE_MODE: (moduleState: IGeneralState, mode: ETypeMode) => {
    moduleState.appearance.typeMode = mode;
  },
  SET_EDIT_MODE: (moduleState: IGeneralState, mode: EEditMode) => {
    moduleState.appearance.editMode = mode;
  },
};

const actions: ActionTree<IGeneralState, IRootState> = {
  LISTEN_FOR_GENERAL: (moduleState: ActionContext<IGeneralState, IRootState>) => {
    const { dispatch, commit } = moduleState;

    ipcRenderer.on(IPC_OTHER.SET_READ_MODE, (e, mode: boolean) => {
      commit("SET_READ_MODE", mode);
      moduleState.rootState.workBench.currentGroup[
        moduleState.rootState.workBench.currentIndex
      ].readMode = mode;
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
