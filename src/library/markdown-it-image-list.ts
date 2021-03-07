/**
 * @repo: https://github.com/martinheidegger/markdown-it-replace-link
 */

import Token from "markdown-it/lib/token";
import MarkdownIt from "markdown-it";

type TReplace = (attr: string, env: any, token: Token) => string;
type TCallback = (list: Array<string>) => void;

declare interface IOption {
  replaceLink: TReplace;
  callback: TCallback;
}

function replaceAttr(
  list: Array<string>,
  token: Token,
  attrName: string,
  replace: TReplace,
  env: any
) {
  token.attrs?.forEach((attr) => {
    if (attr[0] === attrName) {
      // before replace
      list.push(attr[1]);
      attr[1] = replace(attr[1], env, token);
    }
  });
}

export default (md: MarkdownIt, opts: IOption) => {
  md.core.ruler.after("inline", "replace-link", (state) => {
    let replace: TReplace;
    let callback: TCallback = () => {};

    if (
      (md.options as any).replaceLink &&
      typeof (md.options as any).replaceLink === "function"
    ) {
      // Use markdown options (default so far)
      replace = (md.options as any).replaceLink;
    } else if (opts && opts.replaceLink && typeof opts.replaceLink === "function") {
      // Alternatively use plugin options provided upon .use(..)
      replace = opts.replaceLink;
    } else {
      return false;
    }

    if (
      (md.options as any).callback &&
      typeof (md.options as any).callback === "function"
    ) {
      callback = (md.options as any).callback;
    } else if (opts.callback && typeof opts.callback === "function") {
      callback = opts.callback;
    }

    const list: Array<string> = [];

    state.tokens.forEach((blockToken) => {
      if (blockToken.type === "inline" && blockToken.children) {
        blockToken.children.forEach((token) => {
          if (token.type === "image") {
            replaceAttr(list, token, "src", replace, state.env);
          }
        });
      }
    });

    callback(list);

    return false;
  });
};
