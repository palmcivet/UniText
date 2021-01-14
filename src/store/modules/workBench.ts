import * as fse from "fs-extra";
import { MutationTree, ActionContext, GetterTree, ActionTree } from "vuex";

import { charCount, wordCount } from "@/common/editor";
import { fetchFileInfo, joinPath } from "@/common/fileSystem";
import { formatDate, hashCode, notEmpty } from "@/common/utils";
import { importFrontMatter, exportFrontMatter } from "@/common/editor/front-matter";
import { TFileRoute } from "@/typings/modules/sideBar";
import { IRootState } from "@/typings/store";
import { EEol, IDocumentFrontMatter } from "@/typings/document";
import { IGeneralStateEditor } from "@/typings/modules/general";
import { IWorkBenchState, IFile, TTab } from "@/typings/modules/workBench";
import { ipcRenderer } from "electron";
import { IPC_EVENT } from "@/common/channel";

const fileSelect = (stateTree: IWorkBenchState) =>
  stateTree.currentFileGroup[stateTree.currentFileIndex];

const getDefaultFile = (doc: IGeneralStateEditor): IFile => {
  return {
    tag: doc.tag,
    remark: "",
    complete: false,
    metaInfo: {
      createDate: formatDate(new Date()),
      modifyDate: formatDate(new Date()),
      wordCount: 0,
      charCount: 0,
      duration: 0,
    },
    format: doc.fileinfo,
    config: doc.config,
    content: "",
    title: [`Untitled-${titleId}`],
    needSave: true,
  };
};

let titleId = 0;

const state: IWorkBenchState = {
  historyFileIndex: "",
  currentFileIndex: "",
  currentFileGroup: {},
  currentTabs: [],
};

const getters: GetterTree<IWorkBenchState, IRootState> = {
  currentFile: (moduleState: IWorkBenchState) => {
    return {
      order: moduleState.currentFileIndex,
      value: moduleState.currentFileGroup[moduleState.currentFileIndex],
    };
  },
  isBlank: (moduleState: IWorkBenchState) => {
    return !notEmpty(moduleState.currentTabs);
  },
};

const mutations: MutationTree<IWorkBenchState> = {
  /* 以下为编辑器设置 */
  SET_INDENT: (moduleState: IWorkBenchState, indent: 2 | 4) => {
    const curFile = fileSelect(moduleState);
    curFile.format.indent = indent;
  },

  SET_ENCODING: (moduleState: IWorkBenchState, encoding: string) => {
    const curFile = fileSelect(moduleState);
    curFile.format.encoding = encoding;
  },

  SET_END_OF_FILE: (moduleState: IWorkBenchState, eol: EEol) => {
    const curFile = fileSelect(moduleState);
    curFile.format.endOfLine = eol;
  },

  /* 以下为修改文档信息 */
  SET_TAG: (moduleState: IWorkBenchState, tag: string) => {
    const curFile = fileSelect(moduleState);
    curFile.tag = tag;
  },

  SET_COMMENT: (moduleState: IWorkBenchState, remark: string) => {
    const curFile = fileSelect(moduleState);
    curFile.remark = remark;
  },

  /* 以下为设置附加属性 */
  SET_PIC_STORAGE: (moduleState: IWorkBenchState, comment: string) => {},
  SET_AUTO_SAVE: (moduleState: IWorkBenchState, comment: string) => {},
  SET_AUTO_SYNC: (moduleState: IWorkBenchState, comment: string) => {},
  SET_COMPLETE: (moduleState: IWorkBenchState, comment: string) => {},

  /* 更新标签组，更新体现为添加和删除 */
  SYNC_TABS: (moduleState: IWorkBenchState) => {
    const newTabs: Array<TTab> = [];
    const group = Object.keys(moduleState.currentFileGroup);
    group.forEach((v) => {
      const t = moduleState.currentFileGroup[Number(v)].title;
      newTabs.push({
        order: v,
        value: t[t.length - 1],
      });
    });
    moduleState.currentTabs = newTabs;
  },

  /* 切换标签页 */
  SELECT_TAB: (moduleState: IWorkBenchState, payload: { cur: string; his?: string }) => {
    moduleState.historyFileIndex =
      payload.his !== undefined ? payload.his : moduleState.currentFileIndex;
    moduleState.currentFileIndex = payload.cur;
  },

  /* 拖拽更改标签位置 */
  SWITCH_TABS: (moduleState: IWorkBenchState, value: Array<TTab>) => {
    moduleState.currentTabs = value;
  },

  /* 标记文件修改状态 */
  TOGGLE_MODIFY: (moduleState: IWorkBenchState) => {
    const curFile = fileSelect(moduleState);
    curFile.needSave = !curFile.needSave;
  },
};

const actions: ActionTree<IWorkBenchState, IRootState> = {
  NEW_FILE: (moduleState: ActionContext<IWorkBenchState, IRootState>, title?: string) => {
    const untitled = getDefaultFile(moduleState.rootState.general.editor);
    titleId += 1;
    moduleState.dispatch("LOAD_FILE", {
      file: untitled,
      index: hashCode(joinPath(...untitled.title)),
    });
    /* 根据是否传入 title 确定从资源管理器新建还是 tab 栏新建，前者需要写入磁盘 */
    if (title) {
      moduleState.dispatch("SAVE_FILE", untitled);
    }
  },

  LOAD_FILE: (
    moduleState: ActionContext<IWorkBenchState, IRootState>,
    payload: { file: IFile; index: string }
  ) => {
    moduleState.state.currentFileGroup[payload.index] = payload.file;
    moduleState.commit("SELECT_TAB", { cur: payload.index });
    moduleState.commit("SYNC_TABS");
  },
  /**
   * 打开文件
   * @param path 相对路径字符串数组，需要结合根路径
   */
  OPEN_FILE: async (
    moduleState: ActionContext<IWorkBenchState, IRootState>,
    route: TFileRoute
  ) => {
    const editor = moduleState.rootState.general.editor;
    const path = joinPath(moduleState.rootState.sideBar.filesState.folderDir, ...route);
    const res = importFrontMatter((await fse.readFile(path)).toString());

    let doc: IDocumentFrontMatter;

    // FEAT 校验字段
    if (res.data === undefined) {
      const info = await fetchFileInfo(path);
      doc = {
        tag: editor.tag,
        remark: "",
        complete: false,
        metaInfo: {
          wordCount: wordCount(res.content),
          charCount: charCount(res.content),
          createDate: formatDate(info.createDate),
          modifyDate: formatDate(info.modifyDate),
          duration: 0,
        },
        format: {
          ...editor.fileinfo,
        },
        config: {
          ...editor.config,
        },
      };
    } else {
      doc = { ...res.data };
    }

    return moduleState.dispatch("LOAD_FILE", {
      file: {
        title: route,
        needSave: false,
        content: res.content,
        ...doc,
      },
      index: hashCode(path),
    });
  },

  SAVE_FILE: (
    moduleState: ActionContext<IWorkBenchState, IRootState>,
    content: string
  ) => {
    const { title, needSave, content: nouse, ...payload } = fileSelect(moduleState.state);
    // if (!needSave) return;
    const markdown = exportFrontMatter({
      sep: "---",
      data: payload as IDocumentFrontMatter,
      prefix: true,
      content,
    });
    const path = joinPath(moduleState.rootState.sideBar.filesState.folderDir, ...title);
    fse.writeFile(path, markdown);
  },

  /**
   * 关闭标签页的逻辑
   *
   * 1. 先判断 `currentTabs` 数组长度
   * 2. 找到对应的下标 `index`
   *
   * 下一个页标签为 `Math.abs(index - 1)`
   */
  CLOSE_FILE: (
    moduleState: ActionContext<IWorkBenchState, IRootState>,
    index: string
  ) => {
    const selectState = moduleState.state;

    /* 保存标签页的内容 */
    if (selectState.currentFileGroup[index].needSave) {
      ipcRenderer.send(IPC_EVENT.FILE_SAVE);
    }

    /* 删除标签页的内容 */
    delete selectState.currentFileGroup[index];

    /**
     * 找到在标签组中的下标，找不到返回 `-1`，数组为空也即找不到
     * 数组特性，使得每个 `order` 唯一对应，且最后一次关闭时仍不为空
     * 传入非 `-1` 值表示删除
     */
    const tIndex = selectState.currentTabs.findIndex((tab: TTab) => tab.order === index);
    moduleState.commit("SYNC_TABS");

    /**
     * 删除标签页后的行为。切换标签页
     * 删除后原 `index` 将被后一个元素填充
     * 假设是标签组中最后一个元素，
     */
    const tLength = selectState.currentTabs.length;
    if (tLength !== 0) {
      moduleState.commit("SELECT_TAB", {
        cur: selectState.currentTabs[tLength !== tIndex ? tIndex : tIndex - 1].order,
        his: selectState.currentTabs[tLength - 1].order,
      });
    }
  },

  RENAME_FILE: (
    moduleState: ActionContext<IWorkBenchState, IRootState>,
    title: string
  ) => {},
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
