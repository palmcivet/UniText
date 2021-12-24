import MarkdownIt from "markdown-it";
import MarkdownItSup from "markdown-it-sup";
import MarkdownItSub from "markdown-it-sub";
import MarkdownItIns from "markdown-it-ins";
import MarkdownItMark from "markdown-it-mark";
import MarkdownItEmoji from "markdown-it-emoji";
// import MarkdownItImsize from "markdown-it-imsize";
import MarkdownItFootnote from "markdown-it-footnote";
import MarkdownItTaskLists from "markdown-it-task-lists";
import MarkdownItKatex from "@iktakahiro/markdown-it-katex";
import MarkdownItImplicitFigures from "markdown-it-implicit-figures";
// import MarkdownItImageLazyLoading from "markdown-it-image-lazy-loading";
import MarkdownItImageList from "@/library/markdown-it-image-list";
import MarkdownItTocAndAnchor, { ITocItem } from "@/library/markdown-it-toc-and-anchor";
import MarkdownItHighlightLines from "@/library/markdown-it-hightlight-lines";
import { EventBus } from "@palmcivet/unitext-tree-view";

import { BUS_CHANNEL } from "@/shared/channel";
import { IMarkdown } from "@/shared/typings/setting/markdown";
import { IDisposable } from "@/shared/typings/renderer";
import useWorkbench from "@/renderer/stores/workbench";

const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

/**
 * 生成以下格式：
 * - Markdown
 * - Array
 * - HTML
 *
 * 基于 Source 适用于以下场景：
 * - Monaco 生成 TOC
 * - CodeMirror 生成 TOC
 * - HTML 生成 TOC（链接跳转）
 */

export default class MarkdownEngine implements IDisposable {
  /**
   * @description 事件同步
   */
  private readonly bus: EventBus;

  private engine!: MarkdownIt;

  constructor(bus: EventBus) {
    this.bus = bus;
  }

  public invoke(): void {}

  public update(data: IMarkdown): void {
    this.engine = new MarkdownIt({
      html: data.habit.html,
      breaks: data.habit.hardBreaks,
      linkify: data.habit.linkify,
      typographer: data.feature.typographer,
    });

    this.engine.validateLink = (url) => {
      let str = url.trim().toLowerCase();
      return BAD_PROTO_RE.test(str) ? !!GOOD_DATA_RE.test(str) : true;
    };

    this.engine.use(MarkdownItImageList, {
      // FEAT 图床
      replaceLink: (link: string, env: any) => "" + link,
      callback: (list: Array<string>) => {
        this.bus.emit(BUS_CHANNEL.EDITOR_SYNC_IMG, list);
      },
    });

    this.engine.use(MarkdownItTocAndAnchor, {
      toc: data.extend.toc,
      tocClassName: "toc-list",
      tocFirstLevel: 2,
      tocLastLevel: 6,
      anchorLink: false,
      tocCallback: (tocMarkdown: string, tocArray: Array<ITocItem>, tocHtml: string) => {
        useWorkbench().SYNC_TOC({
          markdown: tocMarkdown,
          array: tocArray,
          html: tocHtml,
        });
      },
    });

    // FEAT 未成功输出
    this.engine.use(MarkdownItHighlightLines);

    data.extend.sup && this.engine.use(MarkdownItSup);
    data.extend.sub && this.engine.use(MarkdownItSub);
    data.extend.mark && this.engine.use(MarkdownItMark);
    data.extend.insert && this.engine.use(MarkdownItIns);
    data.feature.emoji && this.engine.use(MarkdownItEmoji);
    data.feature.katex && this.engine.use(MarkdownItKatex);
    data.extend.footnote && this.engine.use(MarkdownItFootnote);
    data.extend.todoList &&
      this.engine.use(MarkdownItTaskLists, {
        label: true,
        labelAfter: true,
      });
    // this.engine.use(MarkdownItImsize);
    this.engine.use(MarkdownItImplicitFigures, {
      dataType: true,
      figcaption: true,
      tabindex: true,
      link: false,
    });
    // this.engine.use(MarkdownItImageLazyLoading);

    this.bus.on(BUS_CHANNEL.EDITOR_SYNC_DOC, this.onGenerate.bind(this));
  }

  public dispose(): void {
    this.bus.off(BUS_CHANNEL.EDITOR_SYNC_DOC, this.onGenerate);
  }

  private onGenerate(content: string) {
    const rawHTML = this.engine.render(content);
    this.bus.emit(BUS_CHANNEL.EDITOR_SYNC_VIEW, rawHTML);
    return rawHTML;
  }
}
