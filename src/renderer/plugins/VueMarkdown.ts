import { VueConstructor } from "vue/types/umd";

/* -------------------------- types ------------------------------- */

export interface IVueMarkdown {
  readonly $markdown: MarkdownEngine;
}

/* -------------------------- class ------------------------------- */

import MarkdownIt from "markdown-it";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItEmoji from "markdown-it-emoji";
import MarkdownItImsize from "markdown-it-imsize";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItTaskLists from "markdown-it-task-lists";
import MarkdownItKatex from "@iktakahiro/markdown-it-katex";
import MarkdownItImplicitFigures from "markdown-it-implicit-figures";
import MarkdownItImageLazyLoading from "markdown-it-image-lazy-loading";

import MarkdownItTocAndAnchor from "@/library/markdown-it-toc-and-anchor";
import MarkdownItHighlightLines from "@/library/markdown-it-hightlight-lines";

import { BUS_EDITOR } from "@/common/channel/bus";
import { Bus } from "@/renderer/plugins/VueBus";
import { ITocList } from "@/typings/renderer";

const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

const markdownEngine = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

markdownEngine.validateLink = (url) => {
  let str = url.trim().toLowerCase();
  return BAD_PROTO_RE.test(str) ? !!GOOD_DATA_RE.test(str) : true;
};

markdownEngine.use(MarkdownItHighlightLines);
markdownEngine.use(MarkdownItTocAndAnchor, {
  toc: true,
  tocClassName: "toc-list",
  tocFirstLevel: 2,
  tocLastLevel: 6,
  anchorLink: false,
  tocCallback: (tocMarkdown: string, tocArray: Array<ITocList>, tocHtml: string) => {
    Bus.emit(BUS_EDITOR.SYNC_TOC, tocArray);
  },
});

markdownEngine.use(MarkdownItSup);
markdownEngine.use(MarkdownItSub);
markdownEngine.use(MarkdownItMark);
markdownEngine.use(MarkdownItEmoji);
markdownEngine.use(MarkdownItImsize);
markdownEngine.use(MarkdownItFootnote);
markdownEngine.use(MarkdownItKatex);
markdownEngine.use(MarkdownItTaskLists, {
  label: true,
  labelAfter: true,
});
markdownEngine.use(MarkdownItImplicitFigures, {
  dataType: true,
  figcaption: false,
  tabindex: true,
  link: false,
});
markdownEngine.use(MarkdownItImageLazyLoading);

export { markdownEngine };

class MarkdownEngine {
  constructor() {}
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>) => {
  const proto = Vue.prototype;
  proto.$markdown = proto.$markdown || new MarkdownEngine();
};

export default {
  install,
};
