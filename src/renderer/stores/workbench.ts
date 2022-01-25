import { defineStore } from "pinia";

import { ITocItem } from "@/library/markdown-it-toc-and-anchor";
import { ID_PREVIEW } from "@/shared/constant";
import { $id } from "@/shared/utils";
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
import { useDialog, useDisk, useService, useShell } from "../composables";

export function TemplateFactory({
  body,
  title,
  styleText = "",
  styleLink = [],
  scriptLink = [],
}: {
  body: string;
  title: string;
  styleText?: string;
  styleLink?: Array<string>;
  scriptLink?: Array<string>;
}) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    ${styleLink.map((style) => `<link rel="stylesheet" type="text/css" href="${style}" />`).join("")}
    <style>${styleText}</style>
</head>
<body>
    ${scriptLink.map((script) => `<script src="${script}"></script>`).join("")}
    ${body}
</body>
</html>`;

  return html;
}

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

    EXPORT_MD() {},

    async EXPORT_HTML() {
      // TODO 获得默认路径才用专有接口，用户自定义+缓存上一次结果
      const defaultPath = await useService("EnvService").getCabinPath();
      const { filePath, canceled } = await useDialog().showSaveDialog({
        filters: [{ name: "HTML", extensions: ["html"] }],
        defaultPath,
      });

      if (filePath == undefined || canceled) {
        return;
      }

      try {
        const rawHtml = TemplateFactory({
          body: `
<div id="#markdown-preview" class="line-numbers match-braces rainbow-braces">${$id(ID_PREVIEW).innerHTML}<div>`,
          title: "",
          styleText: `
#markdown-preview {
  margin: 2em 15%;
}`,
          styleLink: [
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/themes/prism.min.css",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/toolbar/prism-toolbar.min.css",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.css",
          ],
          scriptLink: [
            "https://cdn.jsdelivr.net/npm/katex-copytex@latest/dist/katex-copytex.min.js",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/components/prism-core.min.js",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/toolbar/prism-toolbar.min.js",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.js",
            "https://cdn.bootcdn.net/ajax/libs/prism/1.23.0/plugins/show-language/prism-show-language.min.js",
          ],
        });
        await useDisk().writeFile([filePath], rawHtml);
        useShell().showItemInFolder(filePath);
      } catch (error) {}
    },

    async EXPORT_PDF() {
      const defaultPath = await useService("EnvService").getCabinPath();
      const { filePath, canceled } = await useDialog().showSaveDialog({
        filters: [{ name: "PDF", extensions: ["pdf"] }],
        defaultPath,
      });

      if (filePath == undefined || canceled) {
        return;
      }

      try {
        const rawHtml = `
        <div id="#markdown-preview" class="line-numbers match-braces rainbow-braces">${$id(ID_PREVIEW).innerHTML}<div>`;
        await useService("WindowService").printToPDF([filePath], rawHtml);
        useShell().showItemInFolder(filePath);
      } catch (error) {}
    },
  },
});
