/**
 * 保存 settings 中 article 相关的副本
 * 由 state 维护打开的文件
 */

import { IDocument, IDocumentFormat, IDocumentConfig, EEol } from "@/interfaces/document";
import { MutationTree, ActionContext, GetterTree, Module, ActionTree } from "vuex";

interface IFile extends IDocument {
  modify: boolean; // 是否改动
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

const state: IEditor = {
  currentFileIndex: 0,
  currentFileGroup: {},
  currentTabs: [
    { order: 1, value: "操作系统" },
    { order: 2, value: "Node 参考" },
    { order: 10, value: "从数据结构和算法看大数据与云计算：算法分析" },
    { order: 20, value: "Rust 语法" },
    { order: 4, value: "Go 指南" },
    { order: 5, value: "TypeScript" },
    { order: 16, value: "Flutter" },
    { order: 7, value: "Babel 参考" },
    { order: 8, value: "数据结构和算法" },
    { order: 9, value: "MySQL 数据库" },
  ],
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
    return fileSelect(moduleState);
  },
};

const mutations: MutationTree<IEditor> = {
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
  SWITCH_TABS: (moduleState: IEditor, value: Array<{ order: number; value: string }>) => {
    console.log(value);
    moduleState.currentTabs = value;
  },
  SELECT_TAB: (moduleState: IEditor, id: number) => {
    console.log(id);
    moduleState.currentFileIndex = id;
  },
  TOGGLE_MODIFY: (moduleState: IEditor) => {
    const curFile = fileSelect(moduleState);
    curFile.modify = !curFile.modify;
  },
};

const actions: ActionTree<IEditor, any> = {
  NEW_FILE: (moduleState: ActionContext<IEditor, any>, title?: string) => {},
  OPEN_FILE: (moduleState: ActionContext<IEditor, any>) => {},
  SAVE_FILE: (moduleState: ActionContext<IEditor, any>, title?: string) => {},
  CLOSE_TAB: (moduleState: ActionContext<IEditor, any>, id: number) => {
    moduleState.commit("SAVE_FILE");
    delete moduleState.getters.currentFileGroup[id];
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
