import { VueConstructor } from "vue/types/umd";

/* -------------------------- types ------------------------------- */

interface IPluginOptions {
  base: string;
}

export interface IVueMarkdown {
  readonly $markdown: MarkdownEngine;
}

/* -------------------------- class ------------------------------- */
import Store from "electron-store";
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

import schema from "@/common/schema/sMarkdown";
import { BUS_EDITOR } from "@/common/channel/bus";
import { Bus } from "@/renderer/plugins/VueBus";
import { ITocList } from "@/typings/renderer";
import { IMarkdown } from "@/typings/schema/markdown";

const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

class MarkdownEngine {
  private _dataSet!: Store<IMarkdown>;

  private _filePath!: string;

  private engine!: MarkdownIt;

  constructor(opt: IPluginOptions) {
    this.setBasePath(opt.base);
  }

  setBasePath(filePath: string) {
    this._filePath = filePath;
    this._dataSet = new Store({
      cwd: filePath,
      name: "markdown",
      schema: schema as Store.Schema<IMarkdown>,
    });
    this._initEngine();
  }

  private _initEngine() {
    this.engine = new MarkdownIt({
      html: true,
      breaks: this.getItem("habit.hardBreaks"),
      linkify: this.getItem("habit.linkify"),
    });

    this.engine.validateLink = (url) => {
      let str = url.trim().toLowerCase();
      return BAD_PROTO_RE.test(str) ? !!GOOD_DATA_RE.test(str) : true;
    };

    this.engine.use(MarkdownItHighlightLines);
    this.engine.use(MarkdownItTocAndAnchor, {
      toc: true,
      tocClassName: "toc-list",
      tocFirstLevel: 2,
      tocLastLevel: 6,
      anchorLink: false,
      tocCallback: (tocMarkdown: string, tocArray: Array<ITocList>, tocHtml: string) => {
        Bus.emit(BUS_EDITOR.SYNC_TOC, tocArray);
      },
    });

    this.engine.use(MarkdownItSup);
    this.engine.use(MarkdownItSub);
    this.engine.use(MarkdownItMark);
    this.engine.use(MarkdownItEmoji);
    this.engine.use(MarkdownItImsize);
    this.engine.use(MarkdownItFootnote);
    this.engine.use(MarkdownItKatex);
    this.engine.use(MarkdownItTaskLists, {
      label: true,
      labelAfter: true,
    });
    this.engine.use(MarkdownItImplicitFigures, {
      dataType: true,
      figcaption: false,
      tabindex: true,
      link: false,
    });
    this.engine.use(MarkdownItImageLazyLoading);
  }

  getAll() {
    return this._dataSet.store;
  }

  setItem(key: MapGet<IMarkdown>, val: any) {
    this._dataSet.set(key, val);
  }

  getItem(key: MapGet<IMarkdown>): any {
    this._dataSet.get(key);
  }

  render(val: string) {
    return this.engine.render(val);
  }
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>, options: IPluginOptions) => {
  const proto = Vue.prototype;
  proto.$markdown = proto.$markdown || new MarkdownEngine(options);
};

export default {
  install,
};
