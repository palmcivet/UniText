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
import { VueBus } from "@/renderer/bus";
import { BUS_TOC } from "@/common/channel";
import markdownItTocAndAnchor, { ITocList } from "@/common/editor/create-toc";

const markdownEngine = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

markdownEngine.validateLink = (url) => {
  let str = url.trim().toLowerCase();
  return BAD_PROTO_RE.test(str) ? !!GOOD_DATA_RE.test(str) : true;
};

markdownEngine.use(MarkdownItKatex);
markdownEngine.use(markdownItTocAndAnchor, {
  toc: true,
  tocClassName: "markdownIt-TOC",
  tocFirstLevel: 2,
  tocLastLevel: 6,
  anchorLink: false,
  tocCallback: (tocMarkdown: string, tocArray: Array<ITocList>, tocHtml: string) => {
    VueBus.$emit(BUS_TOC.SYNC_TOC, tocArray);
  },
});
markdownEngine.use(MarkdownItTaskLists, {
  label: true,
  labelAfter: true,
});
markdownEngine.use(MarkdownItMark);
markdownEngine.use(MarkdownItSup);
markdownEngine.use(MarkdownItSub);
markdownEngine.use(MarkdownItFootnote);
markdownEngine.use(MarkdownItEmoji);
markdownEngine.use(MarkdownItImsize);
markdownEngine.use(MarkdownItImplicitFigures, {
  dataType: true,
  figcaption: false,
  tabindex: true,
  link: false,
});
markdownEngine.use(MarkdownItImageLazyLoading);

export { markdownEngine };
