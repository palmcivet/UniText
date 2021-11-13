import { defineStore } from "pinia";

import { EEditMode, EPanelType, ETypeMode } from "@/shared/typings/setting/preference";
import { IGeneralState } from "@/shared/typings/store";

export default defineStore({
  id: "general",

  state: (): IGeneralState => ({} as IGeneralState),

  getters: {},

  actions: {
    FILL_STORE(state: IGeneralState) {
      this.$state = state;
    },

    TOGGLE_SIDE_BAR() {
      this.interface.showSideBar = !this.interface.showSideBar;
    },

    TOGGLE_STATUS_BAR() {
      this.interface.showStatusBar = !this.interface.showStatusBar;
    },

    TOGGLE_CHECK() {
      this.interface.dbColumn = !this.interface.dbColumn;
    },

    TOGGLE_PANEL() {
      this.interface.showPanel = !this.interface.showPanel;
    },

    TOGGLE_PANEL_STYLE() {
      this.interface.panelFloat = !this.interface.panelFloat;
    },

    SET_PANEL_TYPE(type: EPanelType) {
      this.interface.panelType = type;
    },

    SET_READ_MODE(mode: boolean) {
      this.interface.readMode = mode;
    },

    SET_TYPE_MODE(mode: ETypeMode) {
      this.interface.typeMode = mode;
    },

    SET_EDIT_MODE(mode: EEditMode) {
      this.interface.editMode = mode;
    },
  },
});
