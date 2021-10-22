import { defineStore } from "pinia";
import { ipcRenderer } from "electron";

import { IPC_EXPORT } from "@/shared/channel/ipc";
import { BUS_EDITOR } from "@/shared/channel/bus";
import { $id } from "@/shared/utils";
import { Bus } from "@/renderer/plugins/VueBus";
import { IStatusPanelState } from "@/typings/store/status";

let shouldSync = true;

export default defineStore({
  id: "statusPanel",

  state: (): IStatusPanelState => ({
    toc: [],
    export: {},
    imageList: [],
  }),

  getters: {
    isEmptyToc: (_) => {
      return !!_.toc.length;
    },
  },

  actions: {
    SYNC_TOC(value: Array<ITocItem>) {
      this.toc = value;
    },

    SYNC_IMGLIST(value: Array<string>) {
      if (shouldSync) {
        this.imageList = value;
      }
      shouldSync = !shouldSync;
    },

    EXPORT(args: string[]) {
      switch (args[0]) {
        case "MD":
          break;
        case "HTML":
          ipcRenderer.send(IPC_EXPORT.AS_HTML, $id("markdown-preview").innerHTML);
          break;
        case "PDF":
          ipcRenderer.send(IPC_EXPORT.AS_PDF, $id("markdown-preview").innerHTML);
          break;
      }
    },

    LISTEN_FOR_STATUS() {
      Bus.on(BUS_EDITOR.SYNC_TOC, (toc) => this.SYNC_TOC(toc));
      Bus.on(BUS_EDITOR.SYNC_IMGLIST, (list: any) => this.SYNC_IMGLIST(list));
    },
  },
});
