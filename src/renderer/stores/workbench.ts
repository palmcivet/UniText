import { defineStore } from "pinia";

import { ITocItem } from "@/library/markdown-it-toc-and-anchor";
import { useIpc } from "@/renderer/composables/electron";
import { $id } from "@/shared/utils";
import { IPC_EXPORT } from "@/shared/channel/ipc";
import { ITab } from "@/shared/typings/renderer";
import { EWorkbenchType, IWorkbenchState } from "@/shared/typings/store";
import {
  ETXTCoding,
  ETXTEoL,
  ETXTIndent,
  ITXTComputable,
  ITXTFormat,
  EMDPicture,
  IMDFrontMatter,
} from "@/shared/typings/document";

export default defineStore({
  id: "workbench",

  state: (): IWorkbenchState => ({
    workbenchType: EWorkbenchType.EDITOR,
    frontmatter: {
      meta: { cTime: new Date().getTime(), mTime: new Date().getTime(), editTime: 0 },
      config: { remark: "", complete: false, tags: [], picture: EMDPicture.LOCAL },
      images: [],
    },
    computable: { wordCount: 0, charCount: 0, readTime: 0 },
    format: { indent: ETXTIndent.T4, encoding: ETXTCoding.UTF8, endOfLine: ETXTEoL.LF },
    tabList: [],
    tocList: [],
    tocHTML: "",
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

    SET_TAB_STATE(index: number, { type, title, isModified }: ITab) {
      this.tabList[index] = { ...this.tabList[index], type, title, isModified };
    },

    SYNC_TOC({ markdown, array, html }: { markdown: string; array: Array<ITocItem>; html: string }) {
      this.tocList = array;
      this.tocHTML = html;
    },

    SYNC_FRONTMATTER(data: IMDFrontMatter) {
      this.frontmatter = data;
    },

    SYNC_COMPUTABLE(data: ITXTComputable) {
      this.computable = data;
    },

    SYNC_FORMAT(data: ITXTFormat) {
      this.format = data;
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
