/**
 * @GitHub https://github.com/medfreeman/markdown-it-toc-and-anchor
 */

/* eslint-disable no-multi-assign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-continue */
/* eslint-disable comma-spacing */

import clone from "clone";
import uslug from "uslug";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";
import MarkdownIt from "markdown-it";

interface ITocList {
  content: string;
  anchor: string;
  level: number;
  line: [number, number] | null;
}

interface IToc {
  heading: ITocList;
  nodes: IToc[];
}

interface IToken {
  type: string;
  tag: string;
  attrs: [string, string][] | null;
  map: [number, number] | null;
  nesting: 1 | 0 | -1;
  level: number;
  children: IToken[] | null;
  content: string;
  markup: string;
  info: string;
  meta: any;
  block: boolean;
  hidden: boolean;
}

interface ITokenToc extends IToken {
  _tocAnchor?: string;
}

interface IOptionToc {
  toc: boolean;
  tocFirstLevel: number;
  tocLastLevel: number;
  tocCallback: (tocMarkdown: string, tocArray: ITocList, tocHtml: string) => {};
  tocClassName: string;
  anchorClassName: string;
  anchorLink: boolean;
  anchorLinkSpace: boolean;
  anchorLinkPrefix: string;
  anchorLinkBefore: boolean;
  anchorLinkSymbol: string;
  anchorLinkSymbolClassName: string;
  wrapHeadingTextInAnchor: string;
  resetIds: boolean;
  sluglify: (str: string) => string;
}

interface IOption extends MarkdownIt.Options {
  [index: string]: any;
}

const TOC = "[toc]";
const TOC_RE = /^\[toc\]/im;

let headingIds: { [index: string]: number } = {};
let tocHtml = "";

const repeat = (str: string, num: number) => new Array(num + 1).join(str);

const makeSafe = (
  str: string,
  id: { [index: string]: number },
  slugifyFn: (str: string) => string
) => {
  const key = slugifyFn(str);
  if (!id[key]) {
    id[key] = 0;
  }
  id[key] += 1;
  return "h" + key + (id[key] > 1 ? `-${id[key]}` : "");
};

const space = () => {
  return { ...new Token("text", "", 0), content: " " };
};

const renderAnchorLinkSymbol = (options: IOption): IToken[] => {
  if (options.anchorLinkSymbolClassName) {
    return [
      {
        ...new Token("span_open", "span", 1),
        attrs: [["class", options.anchorLinkSymbolClassName]],
      },
      {
        ...new Token("text", "", 0),
        content: options.anchorLinkSymbol,
      },
      new Token("span_close", "span", -1),
    ];
  } else {
    return [
      {
        ...new Token("text", "", 0),
        content: options.anchorLinkSymbol,
      },
    ];
  }
};

const renderAnchorLink = (
  anchor: string,
  options: IOption,
  tokens: IToken[],
  idx: number
) => {
  const attrs: Array<[string, string]> = [];

  if (options.anchorClassName !== null) {
    attrs.push(["class", options.anchorClassName]);
  }

  attrs.push(["href", `#${anchor}`]);

  const openLinkToken = {
    ...new Token("link_open", "a", 1),
    attrs,
  };
  const closeLinkToken = new Token("link_close", "a", -1);

  if (options.wrapHeadingTextInAnchor) {
    (tokens[idx + 1].children as IToken[]).unshift(openLinkToken);
    (tokens[idx + 1].children as IToken[]).push(closeLinkToken);
  } else {
    const linkTokens = [
      openLinkToken,
      ...renderAnchorLinkSymbol(options),
      closeLinkToken,
    ];

    // `push` or `unshift` according to anchorLinkBefore option
    // space is at the opposite side.
    // insert space between anchor link and heading ?
    if (options.anchorLinkSpace) {
      options.anchorLinkBefore ? linkTokens.push(space()) : linkTokens.unshift(space());
    }

    options.anchorLinkBefore
      ? (tokens[idx + 1].children as IToken[]).unshift(...linkTokens)
      : (tokens[idx + 1].children as IToken[]).push(...linkTokens);
  }
};

const treeToMarkdownBulletList = (tree: Array<IToc>, indent = 0) =>
  tree
    .map((item) => {
      const indentation = "  ";
      let node = `${repeat(indentation, indent)}*`;
      if (item.heading.content) {
        const contentWithoutAnchor = item.heading.content.replace(
          /\[([^\]]*)\]\([^)]*\)/g,
          "$1"
        );
        node += ` [${contentWithoutAnchor}](#${item.heading.anchor})\n`;
      } else {
        node += "\n";
      }
      if (item.nodes.length) {
        node += treeToMarkdownBulletList(item.nodes, indent + 1);
      }
      return node;
    })
    .join("");

const generateTocMarkdownFromArray = (headings: Array<ITocList>, options: IOption) => {
  const tree: any = { nodes: [] };

  headings.forEach((heading) => {
    if (heading.level < options.tocFirstLevel || heading.level > options.tocLastLevel) {
      return;
    }

    let lastItem = tree;
    for (let i = 1; i < heading.level - options.tocFirstLevel + 1; i++) {
      if (lastItem.nodes.length === 0) {
        lastItem.nodes.push({
          heading: {},
          nodes: [],
        });
      }
      lastItem = lastItem.nodes[lastItem.nodes.length - 1];
    }
    lastItem.nodes.push({
      heading,
      nodes: [],
    });
  });

  return treeToMarkdownBulletList(tree.nodes);
};

export default function(md: MarkdownIt, opt: IOption) {
  const options = {
    toc: true,
    tocFirstLevel: 1,
    tocLastLevel: 6,
    tocCallback: (...arg: any) => {},
    tocClassName: "markdownIt-TOC",
    anchorLink: true,
    anchorClassName: "markdownIt-Anchor",
    anchorLinkSpace: true,
    anchorLinkPrefix: undefined,
    anchorLinkBefore: true,
    anchorLinkSymbol: "#",
    anchorLinkSymbolClassName: null,
    wrapHeadingTextInAnchor: false,
    resetIds: true,
    sluglify: uslug,
    ...opt,
  };

  const markdownItSecondInstance = clone(md);

  // initialize key ids for each instance
  headingIds = {};

  md.core.ruler.push("init_toc", (state: StateCore): boolean => {
    const tokens: Array<ITokenToc> = state.tokens;

    // reset key ids for each document
    if (options.resetIds) {
      headingIds = {};
    }

    let tocMarkdown = "";
    let tocTokens = [];
    const tocArray = [];

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "heading_close") {
        continue;
      }

      const heading = tokens[i - 1];
      const heading_close = tokens[i];

      if (heading.type === "inline") {
        let content;
        if (
          heading.children &&
          heading.children.length > 0 &&
          heading.children[0].type === "link_open"
        ) {
          // headings that contain links have to be processed
          // differently since nested links aren't allowed in markdown
          content = heading.children[1].content;
          heading._tocAnchor = makeSafe(content, headingIds, options.sluglify);
        } else {
          content = heading.content;
          heading._tocAnchor = makeSafe(
            (heading.children as IToken[]).reduce((acc, t) => acc + t.content, ""),
            headingIds,
            options.sluglify
          );
        }

        if (options.anchorLinkPrefix) {
          heading._tocAnchor = options.anchorLinkPrefix + heading._tocAnchor;
        }

        tocArray.push({
          content,
          anchor: heading._tocAnchor,
          level: +heading_close.tag.substr(1, 1),
          line: heading.map,
        });
      }
    }

    tocMarkdown = generateTocMarkdownFromArray(tocArray, options);

    tocTokens = markdownItSecondInstance.parse(tocMarkdown, {});

    // Adding tocClassName to 'ul' element
    if (typeof tocTokens[0] === "object" && tocTokens[0].type === "bullet_list_open") {
      tocTokens[0].attrs = tocTokens[0].attrs || [];
      const attrs = tocTokens[0].attrs;

      if (options.tocClassName !== null) {
        attrs.push(["class", options.tocClassName]);
      }
    }

    tocHtml = markdownItSecondInstance.renderer.render(tocTokens, options, {});

    if (typeof state.env.tocCallback === "function") {
      state.env.tocCallback.call(undefined, tocMarkdown, tocArray, tocHtml);
    } else if (typeof options.tocCallback === "function") {
      options.tocCallback.call(undefined, tocMarkdown, tocArray, tocHtml);
    }

    return true;
  });

  md.inline.ruler.after("emphasis", "toc", (state, silent) => {
    let token;
    let match;

    if (
      state.src.charCodeAt(state.pos) !== 0x5b ||
      // Don’t run any pairs in validation mode
      silent
    ) {
      return false;
    }

    // Detect TOC markdown
    match = TOC_RE.exec(state.src);
    match = !match ? [] : match.filter((m) => m);
    if (match.length < 1) {
      return false;
    }

    // Build content
    token = state.push("toc_open", "toc", 1);
    token.markup = TOC;
    token = state.push("toc_body", "", 0);
    token = state.push("toc_close", "toc", -1);

    // Update pos so the parser can continue
    state.pos += 6;

    return true;
  });

  const originalHeadingOpen =
    md.renderer.rules.heading_open ||
    function(...args) {
      const [tokens, idx, opti, , self] = args;
      return self.renderToken(tokens, idx, opti);
    };

  md.renderer.rules.heading_open = function(...args) {
    const tokens: Array<ITokenToc> = args[0];
    const idx = args[1];

    const attrs = (tokens[idx].attrs = tokens[idx].attrs || []);
    const anchor = tokens[idx + 1]._tocAnchor as string;
    attrs.push(["id", anchor]);

    if (options.anchorLink) {
      renderAnchorLink(anchor, options, tokens, idx);
    }

    return originalHeadingOpen.apply(this, args);
  };

  md.renderer.rules.toc_open = () => "";
  md.renderer.rules.toc_close = () => "";
  md.renderer.rules.toc_body = () => "";

  if (options.toc) {
    md.renderer.rules.toc_body = () => tocHtml;
  }
}
