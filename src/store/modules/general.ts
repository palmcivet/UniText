/**
 * @enum {EPanelShow} 面板展示形式
 */
enum EPanelShow {
  side,
  hide,
  float,
}

/**
 * @enum {EPanelType} 侧边展示的面板类型
 */
enum EPanelType {
  toc,
  export,
  info,
}

/**
 * @enum {ETypeMode} 编辑模式
 */
enum ETypeMode {
  single,
  contrast,
  richLike,
  typeWrite,
}

/**
 * @interface 通用设置
 */
interface IGeneral {
  showTray: boolean; // 显示托盘
  exitWhenClosed: boolean; // 最后一个窗口关闭时退出
  saveRecent: boolean; // 记录最近打开
  autoOpen: boolean; // 自动打开上一次的文件
  autoUpdate: boolean; // 自动更新
  // TODO 完善语言的接口
  language: string; // 显示语言
  notesPath: string; // 笔记存储位置
  interface: {
    showPanel: EPanelShow; // 右侧面板
    panelType: EPanelType; // 面板展示信息
    showSideBar: boolean; // 显示侧边栏
    showRender: boolean; // 显示预览
    typeMode: ETypeMode; // 编辑模式
    zenMode: boolean; // 启用禅模式
  };
}

const state: IGeneral = {
  showTray: true,
  exitWhenClosed: false,
  saveRecent: true,
  autoOpen: true,
  autoUpdate: true,
  language: "zh-CN",
  notesPath: "~/.unitext",
  interface: {
    showPanel: EPanelShow.side,
    panelType: EPanelType.toc,
    showSideBar: true,
    showRender: false,
    typeMode: ETypeMode.single,
    zenMode: false,
  },
};

const getters = {};

const mutations = {};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
