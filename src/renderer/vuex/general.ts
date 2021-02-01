import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { BUS_EDITOR } from "@/common/channel/bus";
import { IPC_OTHER } from "@/common/channel/ipc";
import { Bus } from "@/renderer/plugins/VueBus";
import { IRootState } from "@/typings/vuex";
import { IGeneralState } from "@/typings/vuex/general";
import { EEditMode, EPanelType, ETypeMode } from "@/typings/preference";

const state = {};

const getters: GetterTree<IGeneralState, IRootState> = {};

const mutations: MutationTree<IGeneralState> = {
  SET_FOLDER: (_: IGeneralState, path: string) => {
    _.fileManager.folderDir = path;
  },

  TOGGLE_SIDE_BAR: (_: IGeneralState) => {
    _.appearance.showSideBar = !_.appearance.showSideBar;
  },

  TOGGLE_STATUS_BAR: (_: IGeneralState) => {
    _.appearance.showStatusBar = !_.appearance.showStatusBar;
  },

  TOGGLE_CHECK: (_: IGeneralState) => {
    _.appearance.dbColumn = !_.appearance.dbColumn;
  },

  TOGGLE_PANEL: (_: IGeneralState) => {
    _.appearance.showPanel = !_.appearance.showPanel;
  },

  TOGGLE_PANEL_STYLE: (_: IGeneralState) => {
    _.appearance.panelFloat = !_.appearance.panelFloat;
  },

  SET_PANEL_TYPE: (_: IGeneralState, type: EPanelType) => {
    _.appearance.panelType = type;
  },

  SET_READ_MODE: (_: IGeneralState, mode: boolean) => {
    _.appearance.readMode = mode;
  },

  SET_TYPE_MODE: (_: IGeneralState, mode: ETypeMode) => {
    _.appearance.typeMode = mode;
  },

  SET_EDIT_MODE: (_: IGeneralState, mode: EEditMode) => {
    _.appearance.editMode = mode;
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
