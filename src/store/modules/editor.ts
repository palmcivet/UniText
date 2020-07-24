/**
 * 保存 settings 中 article 相关的副本
 * 由 state 维护打开的文件
 */

import { IDocument, IDocumentFormat, IDocumentConfig, EEol } from "@/interfaces/document";
import { MutationTree, ActionContext, GetterTree, Module, ActionTree } from "vuex";

export interface IFile extends IDocument {
  title: string; // 文件名
  needSave: boolean; // 是否改动
}

/**
 * @interface 编辑器 state
 */
export interface IEditor {
  /* 以下为编辑器状态 */
  currentFileIndex: number;
  currentFileGroup: { [index: number]: IFile };
  currentTabs: Array<{ order: number; value: string }>;
  /* 以下继承自系统设置，作为文档设置的默认 */
  defaultDoc: {
    tag: string; // 默认标签
    category: string; // 默认分类
    format: IDocumentFormat;
    config: IDocumentConfig;
  };
  lineNumber: true; // 显示行号
  highlightLine: true; // 高亮当前行
}

const fileSelect = (stateTree: IEditor) =>
  stateTree.currentFileGroup[stateTree.currentFileIndex];

let index = 0;

const state: IEditor = {
  currentFileIndex: 0,
  currentFileGroup: {
    "0": {
      tag: "Untag",
      comment: "this is comment",
      metaInfo: {
        createDate: new Date(),
        modifyDate: new Date(),
        wordCount: 12,
        charCount: 12,
        duration: 23,
      },
      format: {
        indent: 2,
        encoding: "UTF-8",
        endOfLine: EEol.LF,
      },
      config: {
        picStorage: "string",
        autoSave: false,
        autoSync: false,
        complete: false,
      },
      content: "## Markdown\n### VSCode",
      title: "操作系统",
      needSave: true,
    },
  },
  currentTabs: [],
  defaultDoc: {
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
      complete: false,
    },
  },
  lineNumber: true,
  highlightLine: true,
};

const getters: GetterTree<IEditor, any> = {
  currentFile: (moduleState: IEditor) => {
    return moduleState.currentFileGroup[moduleState.currentFileIndex];
  },
};

const mutations: MutationTree<IEditor> = {
  /* 以下用于同步 */
  SYNC_CONTENT: (moduleState: IEditor, value: string) => {
    const curFile = fileSelect(moduleState);
    curFile.content = value;
  },
  SYNC_TABS: (moduleState: IEditor) => {
    const newTabs: Array<{ order: number; value: string }> = [];
    const a = Object.keys(moduleState.currentFileGroup);
    a.forEach((v, i) => {
      newTabs.push({
        order: Number(v),
        value: moduleState.currentFileGroup[Number(v)].title,
      });
    });
    moduleState.currentTabs = newTabs;
  },
  /* 以下为编辑器设置 */
  SET_INDENT: (moduleState: IEditor, indent: 2 | 4) => {
    const curFile = fileSelect(moduleState);
    curFile.format.indent = indent;
  },
  SET_ENCODING: (moduleState: IEditor, encoding: string) => {
    const curFile = fileSelect(moduleState);
    curFile.format.encoding = encoding;
  },
  SET_END_OF_FILE: (moduleState: IEditor, eol: EEol) => {
    const curFile = fileSelect(moduleState);
    curFile.format.endOfLine = eol;
  },
  /* 以下为修改文档信息 */
  SET_TAG: (moduleState: IEditor, tag: string) => {
    const curFile = fileSelect(moduleState);
    curFile.tag = tag;
  },
  SET_COMMENT: (moduleState: IEditor, comment: string) => {
    const curFile = fileSelect(moduleState);
    curFile.comment = comment;
  },
  // TODO
  /* 以下为设置附加属性 */
  SET_PIC_STORAGE: (moduleState: IEditor, comment: string) => {},
  SET_AUTO_SAVE: (moduleState: IEditor, comment: string) => {},
  SET_AUTO_SYNC: (moduleState: IEditor, comment: string) => {},
  SET_COMPLETE: (moduleState: IEditor, comment: string) => {},
  /* 以下为切换标签 */
  SELECT_TAB: (moduleState: IEditor, id: number) => {
    moduleState.currentFileIndex = id;
    console.log(id);
  },
  SWITCH_TABS: (moduleState: IEditor, value: Array<{ order: number; value: string }>) => {
    moduleState.currentTabs = value;
  },
  TOGGLE_MODIFY: (moduleState: IEditor) => {
    const curFile = fileSelect(moduleState);
    curFile.needSave = !curFile.needSave;
  },
};

const actions: ActionTree<IEditor, any> = {
  NEW_FILE: (moduleState: ActionContext<IEditor, any>, title?: string) => {
    // TODO 同步默认设置
    const untitled: IFile = {
      tag: "Untag",
      comment: "",
      metaInfo: {
        createDate: new Date(),
        modifyDate: new Date(),
        wordCount: 0,
        charCount: 0,
        duration: 0,
      },
      format: {
        indent: 2,
        encoding: "UTF-8",
        endOfLine: EEol.LF,
      },
      config: {
        picStorage: "string",
        autoSave: false,
        autoSync: false,
        complete: false,
      },
      content: "## Markdown",
      title: "Untitled",
      needSave: true,
    };
    index += 1;
    moduleState.state.currentFileGroup[index] = untitled;
    moduleState.commit("SELECT_TAB", index);
    moduleState.commit("SYNC_TABS");
    // TODO 根据是否传入 title 确定从资源管理器新建还是 tab 栏新建，前者需要写入磁盘
    if (title) {
      moduleState.dispatch("SAVE_FILE");
    }
    console.log("NEW_FILE");
  },
  OPEN_FILE: (moduleState: ActionContext<IEditor, any>) => {},
  SAVE_FILE: (moduleState: ActionContext<IEditor, any>, title?: string) => {},
  CLOSE_TAB: (moduleState: ActionContext<IEditor, any>, id: number) => {
    moduleState.dispatch("SAVE_FILE");
    delete moduleState.state.currentFileGroup[id];
  },
  RENAME_FILE: (moduleState: ActionContext<IEditor, any>, title: string) => {},
};

const module: Module<IEditor, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;
