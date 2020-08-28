import { ActionContext } from "vuex";

import {
  IGeneralState,
  EPanelType,
  ETypeMode,
  EEditMode,
} from "@/interface/vuex/modules/general";
import { EEol } from "@/interface/document";
import { IRootState } from "@/interface/vuex/index";
import { loadSetting } from "@/common/initialize";
import * as pkg from "@/../package.json";

const state: IGeneralState = {
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

const actions = {
  /**
   * 加载、校验笔记文件夹的设置文件
   * @param path 指定笔记文件夹路径
   */
  LOAD_SETTING: (rootState: ActionContext<IRootState, IRootState>, path: string) => {
    loadSetting(path).then((res) => {
      if (!res[1]) {
        // TODO 报错
        console.error(res);
        return;
      }
      rootState.commit("SYNC_SETTING", res[0]);
    });
  },
  /**
   * 保存笔记文件夹的设置
   */
  SAVE_SETTING: (rootState: ActionContext<IRootState, IRootState>) => {
    rootState.commit("LOAD_SETTING");
  },
  /**
   * 获取发行说明，`""` 则表明未更新
   */
  CHECK_UPDATE: (rootState: ActionContext<IGeneralState, IRootState>) => {
    const getVersion = (ver: string) =>
      ver
        .substring(1)
        .split(".")
        .map((item: string) => parseInt(item, 10));
    const currentVersion = getVersion((pkg as any).version);

    let releaseNotes = "";

    fetch("")
      .then((res) => res.json())
      .then((res) => {
        const latestVersion = getVersion(res.data.name);
        for (let i = 0; i < currentVersion.length; i += 1) {
          if (currentVersion[i] < latestVersion[i]) {
            releaseNotes = res.data;
            break;
          }
        }
      });

    // TODO 新版本通知
    if (releaseNotes !== "") {
      rootState.dispatch("");
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
