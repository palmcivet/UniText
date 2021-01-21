import { ipcRenderer } from "electron";
import { ActionContext, ActionTree, GetterTree, MutationTree } from "vuex";

import { IPC_FILE } from "@/common/channel/ipc";
import { BUS_EDITOR } from "@/common/channel/bus";
import { Bus } from "@/renderer/plugins/VueBus";
import { IRootState } from "@/typings/vuex";
import { TFileRoute } from "@/typings/vuex/sideBar";
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

const actions: ActionTree<IGeneralState, IRootState> = {
  LISTEN_FOR_OPEN: (moduleState: ActionContext<IGeneralState, IRootState>) => {
    const { commit, dispatch } = moduleState;

    ipcRenderer.on(IPC_FILE.OPEN_FOR_EDIT, (e, value: TFileRoute) => {
      dispatch("workBench/OPEN_FILE", value, { root: true });
      commit("sideBar/CHOOSE_ITEM", value.join("/"), { root: true });
    });

    ipcRenderer.on(IPC_FILE.OPEN_FOR_VIEW, (e, value: TFileRoute) => {
      dispatch("workBench/OPEN_FILE", value, { root: true });
      commit("sideBar/CHOOSE_ITEM", value.join("/"), { root: true });
      Bus.emit(BUS_EDITOR.SYNC_VIEW);
      commit("TOGGLE_PRESENT");
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
