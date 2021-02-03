import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { BUS_EDITOR } from "@/common/channel/bus";
import { IPC_OTHER } from "@/common/channel/ipc";
import { Bus } from "@/renderer/plugins/VueBus";
import { IRootState } from "@/typings/vuex";
import { IGeneralState } from "@/typings/vuex/general";
import { EEditMode, EPanelType, ETypeMode } from "@/typings/service/preference";

const state = {};

const getters: GetterTree<IGeneralState, IRootState> = {};

const mutations: MutationTree<IGeneralState> = {
  SET_FOLDER: (_: IGeneralState, path: string) => {
    _.fileManager.folderDir = path;
  },

  TOGGLE_SIDE_BAR: (_: IGeneralState) => {
    _.userInterface.showSideBar = !_.userInterface.showSideBar;
  },

  TOGGLE_STATUS_BAR: (_: IGeneralState) => {
    _.userInterface.showStatusBar = !_.userInterface.showStatusBar;
  },

  TOGGLE_CHECK: (_: IGeneralState) => {
    _.userInterface.dbColumn = !_.userInterface.dbColumn;
  },

  TOGGLE_PANEL: (_: IGeneralState) => {
    _.userInterface.showPanel = !_.userInterface.showPanel;
  },

  TOGGLE_PANEL_STYLE: (_: IGeneralState) => {
    _.userInterface.panelFloat = !_.userInterface.panelFloat;
  },

  SET_PANEL_TYPE: (_: IGeneralState, type: EPanelType) => {
    _.userInterface.panelType = type;
  },

  SET_READ_MODE: (_: IGeneralState, mode: boolean) => {
    _.userInterface.readMode = mode;
  },

  SET_TYPE_MODE: (_: IGeneralState, mode: ETypeMode) => {
    _.userInterface.typeMode = mode;
  },

  SET_EDIT_MODE: (_: IGeneralState, mode: EEditMode) => {
    _.userInterface.editMode = mode;
  },
};

const actions: ActionTree<IGeneralState, IRootState> = {
  LISTEN_FOR_GENERAL: (_: ActionContext<IGeneralState, IRootState>) => {
    const { dispatch, commit } = _;

    ipcRenderer.on(IPC_OTHER.SET_READ_MODE, (e, mode: boolean) => {
      commit("SET_READ_MODE", mode);
      _.rootState.workBench.currentGroup[
        _.rootState.workBench.currentIndex
      ].readMode = mode;
      Bus.emit(BUS_EDITOR.SYNC_VIEW);
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
