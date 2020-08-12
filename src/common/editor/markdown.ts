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
import { VueBus } from "@/app/renderer/bus";
import { BUS_TOC } from "@/common/busChannel";
import markdownItTocAndAnchor, { ITocList } from "@/common/editor/create-toc";

const markdownIt = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

markdownIt.validateLink = (url) => {
  let str = url.trim().toLowerCase();
  return BAD_PROTO_RE.test(str) ? !!GOOD_DATA_RE.test(str) : true;
};

markdownIt.use(MarkdownItKatex);
markdownIt.use(markdownItTocAndAnchor, {
  toc: true,
  tocClassName: "markdownIt-TOC",
  tocFirstLevel: 2,
  tocLastLevel: 6,
  anchorLink: false,
  tocCallback: (tocMarkdown: string, tocArray: Array<ITocList>, tocHtml: string) => {
    VueBus.$emit(BUS_TOC.SYNC_TOC, tocArray);
  },
});
markdownIt.use(MarkdownItTaskLists, {
  label: true,
  labelAfter: true,
});
markdownIt.use(MarkdownItMark);
markdownIt.use(MarkdownItSup);
markdownIt.use(MarkdownItSub);
markdownIt.use(MarkdownItFootnote);
markdownIt.use(MarkdownItEmoji);
markdownIt.use(MarkdownItImsize);
markdownIt.use(MarkdownItImplicitFigures, {
  dataType: true,
  figcaption: false,
  tabindex: true,
  link: false,
});
markdownIt.use(MarkdownItImageLazyLoading);

export default markdownIt;
