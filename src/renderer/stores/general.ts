import { defineStore } from "pinia";

import { EEditMode, ETypeMode } from "@/shared/typings/setting/preference";
import { IGeneralState } from "@/shared/typings/store";

export default defineStore({
  id: "general",

  state: (): IGeneralState =>
    ({
      interface: {
        showSideBar: true,
        showStatusBar: true,
        showPanel: true,
        readMode: false,
        dbColumn: true,
        editMode: "SOURCE",
        typeMode: "NORMAL",
      },
      workbench: {
        startup: "CREATE",
        saveRecent: true,
        autoOpen: true,
        autoSave: false,
        saveDelay: 5000,
      },
      browser: {
        ignoreFile: [],
        showIndent: true,
      },
      document: {
        indent: "T4",
        encoding: "UTF8",
        endOfLine: "LF",
        tags: [],
        picture: "LOCAL",
        category: "",
        remark: "",
        complete: false,
      },
    } as IGeneralState),

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

    TOGGLE_PANEL() {
      this.interface.showPanel = !this.interface.showPanel;
    },

    TOGGLE_READ_MODE() {
      this.interface.readMode = !this.interface.readMode;
    },

    TOGGLE_DB_COLUMN() {
      this.interface.dbColumn = !this.interface.dbColumn;
    },

    /**
     * @description 聚合 `TOGGLE_READ_MODE()` | `TOGGLE_DB_COLUMN()` | `TOGGLE_PANEL()`
     * @param mode "readMode" | "dbColumn" | "showPanel"
     */
    TOGGLE_MODE_GROUP(mode: "readMode" | "dbColumn" | "showPanel") {
      this.interface[mode] = !this.interface[mode];
    },

    SET_TYPE_MODE(mode: ETypeMode) {
      this.interface.typeMode = mode;
    },

    SET_EDIT_MODE(mode: EEditMode) {
      this.interface.editMode = mode;
    },
  },
});
