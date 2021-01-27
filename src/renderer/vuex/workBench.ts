import { ipcRenderer, remote } from "electron";
import { MutationTree, ActionContext, GetterTree, ActionTree } from "vuex";
import * as fse from "fs-extra";

import { isWin } from "@/common/env";
import { IPC_FILE } from "@/common/channel/ipc";
import { BUS_EDITOR, BUS_SIDEBAR } from "@/common/channel/bus";
import { charCount, wordCount, timeCalc } from "@/common/editor";
import { fetchFileInfo, joinPath } from "@/common/fileSystem";
import { formatDate, hashCode, notEmpty } from "@/common/utils";
import { importFrontMatter, exportFrontMatter } from "@/common/editor/front-matter";
import { Bus } from "@/renderer/plugins/VueBus";
import { IRootState } from "@/typings/vuex";
import { ITree, TFileRoute } from "@/typings/vuex/sideBar";
import { IDocumentFrontMatter } from "@/typings/document";
import { IWorkBenchState, IFile, TTab } from "@/typings/vuex/workBench";

const fileSelect = (stateTree: IWorkBenchState) =>
  stateTree.currentGroup[stateTree.currentIndex];

let titleId = 0;

const state: IWorkBenchState = {
  historyIndex: "",
  currentIndex: "",
  currentGroup: {},
  currentTabs: [],
};

const getters: GetterTree<IWorkBenchState, IRootState> = {
  currentFile: (_: IWorkBenchState) => {
    return {
      order: _.currentIndex,
      value: fileSelect(_),
    };
  },
  isBlank: (_: IWorkBenchState) => {
    return !notEmpty(_.currentTabs);
  },
};

const mutations: MutationTree<IWorkBenchState> = {
  /* 以下为编辑器设置 */
  SET_INDENT: (_: IWorkBenchState, indent: 2 | 4) => {
    const curFile = fileSelect(_);
    curFile.format.indent = indent;
  },

  SET_ENCODING: (_: IWorkBenchState, encoding: string) => {
    const curFile = fileSelect(_);
    curFile.format.encoding = encoding;
  },

  SET_END_OF_FILE: (_: IWorkBenchState, eol: "LF" | "CRLF") => {
    const curFile = fileSelect(_);
    curFile.format.endOfLine = eol;
  },

  /* 以下为修改文档信息 */
  SET_TAG: (_: IWorkBenchState, tag: string) => {
    const curFile = fileSelect(_);
    curFile.tag = tag;
  },

  SET_COMMENT: (_: IWorkBenchState, remark: string) => {
    const curFile = fileSelect(_);
    curFile.remark = remark;
  },

  /* 以下为设置附加属性 */
  SET_PIC_STORAGE: (_: IWorkBenchState, comment: string) => {},
  SET_AUTO_SAVE: (_: IWorkBenchState, comment: string) => {},
  SET_AUTO_SYNC: (_: IWorkBenchState, comment: string) => {},
  SET_COMPLETE: (_: IWorkBenchState, comment: string) => {},

  /* 更新标签组，更新体现为添加和删除 */
  SYNC_TABS: (_: IWorkBenchState) => {
    const newTabs: Array<TTab> = [];
    for (const [i, v] of Object.entries(_.currentGroup)) {
      newTabs.push({
        order: i,
        title: v.fileName[v.fileName.length - 1],
      });
    }
    _.currentTabs = newTabs;
  },

  /* 切换标签页 */
  SELECT_TAB: (_: IWorkBenchState, payload: { cur: string; his?: string }) => {
    const { his, cur } = payload;
    _.historyIndex = his !== undefined ? his : _.currentIndex;
    _.currentIndex = cur;
  },

  /* 拖拽更改标签位置 */
  SWITCH_TABS: (_: IWorkBenchState, value: Array<TTab>) => {
    _.currentTabs = value;
  },

  /* 标记文件修改状态 */
  TOGGLE_MODIFY: (_: IWorkBenchState) => {
    const curFile = fileSelect(_);
    curFile.needSave = !curFile.needSave;
  },
};

const actions: ActionTree<IWorkBenchState, IRootState> = {
  /**
   * 加载文件
   * 用于 NEW_FILE 或 OPEN_FILE 后，同步状态
   * 流程：SYNC_TABS => SELECT_TAB => sideBar/CHOOSE_ITEM
   */
  SYNC_LOAD: (
    _: ActionContext<IWorkBenchState, IRootState>,
    payload: { file: IFile; index: string }
  ) => {
    const { index, file } = payload;
    const { commit, state } = _;
    state.currentGroup[index] = file;
    commit("SYNC_TABS");
    commit("SELECT_TAB", { cur: index });
    commit("sideBar/CHOOSE_ITEM", file.fileName.join("/"), { root: true });
    Bus.emit(BUS_EDITOR.SYNC_VIEW);
  },

  /**
   * 新建文件
   * 根据是否传入 title 确定从资源管理器新建还是临时新建，前者需要写入磁盘
   * 流程：SYNC_LOAD => (SAVE_FILE)
   */
  NEW_FILE: (_: ActionContext<IWorkBenchState, IRootState>, title?: TFileRoute) => {
    const { dispatch } = _;
    const { tag, format, config } = _.rootState.general.editor;
    const isTemp = title === undefined;

    let fileName: TFileRoute;
    if (isTemp) {
      titleId += 1;
      fileName = [`Untitled-${titleId}`];
    } else {
      fileName = title as TFileRoute;
    }

    const untitled: IFile = {
      tag,
      remark: "",
      complete: false,
      metaInfo: {
        created: formatDate(new Date()),
        modified: formatDate(new Date()),
        wordCount: 0,
        charCount: 0,
        readTime: 0,
        editTime: 0,
      },
      format,
      config,
      content: "",
      fileName,
      needSave: isTemp,
      tempFile: isTemp,
      readMode: false,
    };

    dispatch("SYNC_LOAD", {
      file: untitled,
      index: hashCode(joinPath(...fileName)),
    });

    /**
     * SYNC_LOAD 之后，该文档变为当前标签，因此执行保存，内容为空
     */
    if (!isTemp) {
      dispatch("SAVE_FILE", "");
    }
  },

  /**
   * 打开文件
   * 流程：=> SYNC_LOAD
   */
  OPEN_FILE: async (
    _: ActionContext<IWorkBenchState, IRootState>,
    payload: { route: TFileRoute; isRead?: boolean }
  ) => {
    const { dispatch } = _;
    const { general, sideBar } = _.rootState;
    const { tag, format, config } = general.editor;
    const { route, isRead } = payload;
    const path = joinPath(sideBar.filesState.folderDir, ...route);
    const { data, content } = importFrontMatter((await fse.readFile(path)).toString());

    let doc: IDocumentFrontMatter;

    // FEAT 校验字段
    if (data === undefined) {
      const { createDate, modifyDate } = await fetchFileInfo(path);
      doc = {
        tag: tag,
        remark: "",
        complete: false,
        metaInfo: {
          wordCount: wordCount(content),
          charCount: charCount(content),
          created: formatDate(createDate),
          modified: formatDate(modifyDate),
          readTime: timeCalc(content),
          editTime: 0,
        },
        format: {
          ...format,
        },
        config: {
          ...config,
        },
      };
    } else {
      doc = { ...data };
    }
    dispatch("SYNC_LOAD", {
      file: {
        fileName: route,
        needSave: false,
        tempFile: false,
        readMode: isRead || doc.complete,
        content,
        ...doc,
      } as IFile,
      index: hashCode(path),
    });
  },

  /**
   * 关闭标签页
   *
   * 1. 先判断 `currentTabs` 数组长度
   * 2. 找到对应的下标 `index`
   *
   * 下一个页标签为 `Math.abs(index - 1)`
   *
   * 流程：=> SYNC_TABS => SELECT_TABS => (SELECT_TAB => sideBar/CHOOSE_ITEM)
   */
  CLOSE_FILE: (_: ActionContext<IWorkBenchState, IRootState>, index: string) => {
    const { commit } = _;
    const selectState = _.state;

    /* 保存标签页的内容 */
    if (selectState.currentGroup[index].needSave) {
      ipcRenderer.send(IPC_FILE.SAVE);
    }

    /* 删除标签页的内容 */
    delete selectState.currentGroup[index];

    /**
     * 找到在标签组中的下标，找不到返回 `-1`，数组为空也即找不到
     * 数组特性，使得每个 `order` 唯一对应，且最后一次关闭时仍不为空
     * 传入非 `-1` 值表示删除
     */
    const tIndex = selectState.currentTabs.findIndex((tab: TTab) => tab.order === index);
    commit("SYNC_TABS");

    /**
     * 删除标签页后的行为。切换标签页
     * 删除后原 `index` 将被后一个元素填充
     * 假设是标签组中最后一个元素，
     */
    const tLength = selectState.currentTabs.length;
    if (tLength !== 0) {
      commit("SELECT_TAB", {
        cur: selectState.currentTabs[tLength !== tIndex ? tIndex : tIndex - 1].order,
        his: selectState.currentTabs[tLength - 1].order,
      });
      const path = fileSelect(selectState).fileName.join("/");
      commit("sideBar/CHOOSE_ITEM", path, { root: true });
    }

    Bus.emit(BUS_EDITOR.CLOSE_FILE, index);
  },

  /**
   * 保存文件
   * 目标文件将切换到当前活跃
   */
  SAVE_FILE: async (_: ActionContext<IWorkBenchState, IRootState>, content: string) => {
    const { state, rootState, commit } = _;
    const root = rootState.sideBar.filesState.folderDir;
    const {
      fileName,
      tempFile,
      content: noUse_1,
      needSave: noUse_2,
      readMode: noUse_3,
      ...payload
    } = fileSelect(state);
    const markdown = exportFrontMatter({
      sep: "---",
      data: payload as IDocumentFrontMatter,
      prefix: true,
      content,
    });

    let path = joinPath(root, ...fileName);

    if (tempFile) {
      const res = await remote.dialog.showSaveDialog({
        // FEAT i18n
        title: "保存到",
        properties: ["createDirectory", "showOverwriteConfirmation"],
        defaultPath: path + ".md",
      });

      if (res.filePath === undefined || res.filePath === "") {
        // TODO 完善报错信息
        commit("information/SET_ERROR", "", { root: true });
        return;
      }

      if (res.filePath.indexOf(root) === -1) {
        // TODO 完善报错信息
        commit("information/SET_ERROR", "", { root: true });
      }

      path = res.filePath;
    }

    fse.writeFile(path, markdown);
  },

  RENAME: (_: ActionContext<IWorkBenchState, IRootState>, title: string) => {
    const { fileTree, filesState, activeItem } = _.rootState.sideBar;

    const file = activeItem.split("/");

    let srcObj = fileTree;

    for (let i = 0, item = file[i]; i < file.length - 1; i++) {
      srcObj = fileTree[item].children as ITree;
    }
    const target = file[file.length - 1];
    srcObj[title] = srcObj[target];
    delete srcObj[target];

    const src = joinPath(filesState.folderDir, ...file);
    file[file.length - 1] = title;
    const dst = joinPath(filesState.folderDir, ...file);
    fse.rename(src, dst);
  },

  DELETE: (_: ActionContext<IWorkBenchState, IRootState>) => {
    const { fileTree, filesState, activeItem } = _.rootState.sideBar;

    const file = activeItem.split("/");

    let srcObj = fileTree;

    for (let i = 0, item = file[i]; i < file.length - 1; i++) {
      srcObj = fileTree[item].children as ITree;
    }
    const target = file[file.length - 1];
    delete srcObj[target];

    // FEAT 移至回收站
    const { execSync } = require("child_process");
    const DIR = joinPath(filesState.folderDir, ...file);
    if (isWin) {
      execSync(`del /s ${DIR}`);
    } else {
      execSync(`rm -r ${DIR}`);
    }
  },

  MOVE: (_: ActionContext<IWorkBenchState, IRootState>, title: string) => {},

  LISTEN_FOR_FILE: (_: ActionContext<IWorkBenchState, IRootState>) => {
    const { dispatch, commit, rootState } = _;

    ipcRenderer.on(IPC_FILE.OPEN, (e, route: TFileRoute) => {
      dispatch("OPEN_FILE", { route });
    });

    ipcRenderer.on(IPC_FILE.OPEN_FOR_EDIT, (e, route: TFileRoute) => {
      dispatch("OPEN_FILE", { route, isRead: false });
    });

    ipcRenderer.on(IPC_FILE.OPEN_FOR_VIEW, (e, route: TFileRoute) => {
      dispatch("OPEN_FILE", { route, isRead: true });
    });

    ipcRenderer.on(IPC_FILE.DELETE, (e, route: TFileRoute) => {
      dispatch("DELETE");
    });

    ipcRenderer.on(IPC_FILE.RENAME, (e, route: TFileRoute) => {
      Bus.emit(BUS_SIDEBAR.RENAME);
    });

    ipcRenderer.on(IPC_FILE.REVEAL, (e, route: TFileRoute) => {
      remote.shell.showItemInFolder(
        joinPath(rootState.sideBar.filesState.folderDir, ...route)
      );
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
