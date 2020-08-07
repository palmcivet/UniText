import * as fse from "fs-extra";
import { MutationTree, ActionContext, GetterTree, Module, ActionTree } from "vuex";
import {
  importFrontMatter,
  exportFrontMatter,
  metaInfo2Doc,
} from "@/common/helpers/front-matter";
import { hashCode } from "@/common/helpers/utils";
import { IEditorState, IFile, TTab } from "@/interface/editor";
import { EEol } from "@/interface/document";

const fileSelect = (stateTree: IEditorState) =>
  stateTree.currentFileGroup[stateTree.currentFileIndex];

let titleId = 0;

const state: IEditorState = {
  historyFileIndex: "",
  currentFileIndex: "",
  currentFileGroup: {},
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
};

const getters: GetterTree<IEditorState, any> = {
  currentFile: (moduleState: IEditorState) => {
    return {
      order: moduleState.currentFileIndex,
      value: moduleState.currentFileGroup[moduleState.currentFileIndex],
    };
  },
};

const mutations: MutationTree<IEditorState> = {
  /* 以下为编辑器设置 */
  SET_INDENT: (moduleState: IEditorState, indent: 2 | 4) => {
    const curFile = fileSelect(moduleState);
    curFile.format.indent = indent;
  },

  SET_ENCODING: (moduleState: IEditorState, encoding: string) => {
    const curFile = fileSelect(moduleState);
    curFile.format.encoding = encoding;
  },

  SET_END_OF_FILE: (moduleState: IEditorState, eol: EEol) => {
    const curFile = fileSelect(moduleState);
    curFile.format.endOfLine = eol;
  },

  /* 以下为修改文档信息 */
  SET_TAG: (moduleState: IEditorState, tag: string) => {
    const curFile = fileSelect(moduleState);
    curFile.tag = tag;
  },

  SET_COMMENT: (moduleState: IEditorState, comment: string) => {
    const curFile = fileSelect(moduleState);
    curFile.comment = comment;
  },

  /* 以下为设置附加属性 */
  SET_PIC_STORAGE: (moduleState: IEditorState, comment: string) => {},
  SET_AUTO_SAVE: (moduleState: IEditorState, comment: string) => {},
  SET_AUTO_SYNC: (moduleState: IEditorState, comment: string) => {},
  SET_COMPLETE: (moduleState: IEditorState, comment: string) => {},

  /* 更新标签组，更新体现为添加和删除 */
  SYNC_TABS: (moduleState: IEditorState) => {
    const newTabs: Array<TTab> = [];
    const group = Object.keys(moduleState.currentFileGroup);
    group.forEach((v) => {
      newTabs.push({
        order: v,
        value: moduleState.currentFileGroup[Number(v)].title,
      });
    });
    moduleState.currentTabs = newTabs;
  },

  /* 切换标签页 */
  SELECT_TAB: (moduleState: IEditorState, payload: { cur: string; his?: string }) => {
    moduleState.historyFileIndex =
      payload.his !== undefined ? payload.his : moduleState.currentFileIndex;
    moduleState.currentFileIndex = payload.cur;
  },

  /* 拖拽更改标签位置 */
  SWITCH_TABS: (moduleState: IEditorState, value: Array<TTab>) => {
    moduleState.currentTabs = value;
  },

  /* 标记文件修改状态 */
  TOGGLE_MODIFY: (moduleState: IEditorState) => {
    const curFile = fileSelect(moduleState);
    curFile.needSave = !curFile.needSave;
  },
};

const actions: ActionTree<IEditorState, any> = {
  NEW_FILE: (moduleState: ActionContext<IEditorState, any>, title?: string) => {
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
      content: "",
      title: `Untitled-${titleId}`,
      needSave: true,
    };
    titleId += 1;
    moduleState.dispatch("LOAD_FILE", {
      file: untitled,
      index: hashCode(untitled.title),
    });
    /* 根据是否传入 title 确定从资源管理器新建还是 tab 栏新建，前者需要写入磁盘 */
    if (title) {
      moduleState.dispatch("SAVE_FILE", untitled);
    }
  },

  LOAD_FILE: (
    moduleState: ActionContext<IEditorState, any>,
    payload: { file: IFile; index: string }
  ) => {
    moduleState.state.currentFileGroup[payload.index] = payload.file;
    moduleState.commit("SELECT_TAB", { cur: payload.index });
    moduleState.commit("SYNC_TABS");
  },

  OPEN_FILE: (moduleState: ActionContext<IEditorState, any>, path: string) => {
    fse
      .readFile(path)
      .then((res) => res.toString())
      .then((res) => importFrontMatter(res))
      .then((res) => {
        const dirs = path.split("/");
        // TODO 补全解析
        return moduleState.dispatch("LOAD_FILE", {
          file: {
            title: dirs[dirs.length - 1],
            needSave: false,
            ...metaInfo2Doc(res),
          },
          index: hashCode(path),
        });
      });
  },

  SAVE_FILE: (moduleState: ActionContext<IEditorState, any>, newTitle?: string) => {
    const { title, needSave, ...payload } = fileSelect(moduleState.state);
    const markdown = exportFrontMatter(payload);
    fse.writeFile(newTitle || title, markdown);
  },

  /**
   * 关闭标签页的逻辑
   *
   * 1. 先判断 `currentTabs` 数组长度
   * 2. 找到对应的下标 `index`
   *
   * 下一个页标签为 `Math.abs(index - 1)`
   */
  CLOSE_FILE: (moduleState: ActionContext<IEditorState, any>, index: string) => {
    const selectState = moduleState.state;

    /* 保存标签页的内容 */
    if (selectState.currentFileGroup[index].needSave) {
      // moduleState.dispatch("SAVE_FILE");
    }

    /* 删除标签页的内容 */
    delete selectState.currentFileGroup[index];

    /**
     * 找到在标签组中的下标，找不到返回 `-1`，数组为空也即找不到
     * 数组特性，使得每个 `order` 唯一对应，且最后一次关闭时仍不为空
     * 传入非 `-1` 值表示删除
     */
    const tIndex = selectState.currentTabs.findIndex((tab) => tab.order === index);
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

  RENAME_FILE: (moduleState: ActionContext<IEditorState, any>, title: string) => {},
};

const module: Module<IEditorState, any> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;
