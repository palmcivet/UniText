import { defineStore } from "pinia";

import { useIpc } from "@/renderer/composables/electron";
import { $id } from "@/shared/utils";
import { ITab } from "@/shared/typings/model";
import { IPC_EXPORT } from "@/shared/channel/ipc";
import { ITocItem } from "@/shared/typings/renderer";
import { ECoding, EEoL, EIndent, EPicture, IDocumentFrontMatter } from "@/shared/typings/document";
import { EWorkbenchType, IWorkbenchState } from "@/shared/typings/store";

export default defineStore({
  id: "workbench",

  state: (): IWorkbenchState => ({
    workbenchType: EWorkbenchType.EDITOR,
    frontMatter: {
      config: {
        remark: "",
        complete: false,
        tag: [],
        picture: EPicture.LOCAL,
      },
      format: {
        indent: EIndent.T4,
        encoding: ECoding.UTF8,
        endOfLine: EEoL.LF,
      },
      meta: {
        cTime: new Date().getTime(),
        mTime: new Date().getTime(),
        editTime: 0,
      },
      images: [],
    },
    tabList: [],
    tocList: [],
    // tocMdList: [],
    // tocHTMLList: [],
  }),

  getters: {
    showStartup(_) {
      return _.tabList.length === 0;
    },

    isEditor(_) {
      return _.workbenchType === EWorkbenchType.EDITOR;
    },
  },

  actions: {
    SYNC_TAB(tabList: Array<ITab>) {
      this.tabList = tabList;
    },

    SYNC_TAB_STATE(index: number, { type, title, isModified }: ITab) {
      this.tabList[index] = { ...this.tabList[index], type, title, isModified };
    },

    SYNC_TOC({ markdown, array, html }: { markdown: string; array: Array<ITocItem>; html: string }) {
      this.tocList = array;
    },

    SYNC_FRONTMATTER(frontMatter: IDocumentFrontMatter) {
      this.frontMatter = frontMatter;
    },

    SWITCH_WORKBENCH(type: EWorkbenchType) {
      this.workbenchType = type;
    },

    EXPORT(args: string[]) {
      switch (args[0]) {
        case "MD":
          break;
        case "HTML":
          useIpc().send(IPC_EXPORT.AS_HTML, $id("markdown-preview").innerHTML);
          break;
        case "PDF":
          useIpc().send(IPC_EXPORT.AS_PDF, $id("markdown-preview").innerHTML);
          break;
      }
    },
  },
});
