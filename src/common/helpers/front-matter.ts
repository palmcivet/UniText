/**
 * GitHub: https://github.com/hexojs/hexo-front-matter
 * GitHub: https://github.com/nodeca/js-yaml
 * 源码来自 hexo-front-matter，为其添加类型，修改为 TS 版本
 * 使用的依赖为 js-yaml
 */

import { IDocumentFrontMatter, IDocument } from "@/interface/document";

const yaml = require("js-yaml");

const rPrefixSep = /^(-{3,}|;{3,})/;
const rFrontMatterBefore = /^(-{3,}|;{3,})\n([\s\S]+?)\n\1(?:$|\n([\s\S]*)$)/;
const rFrontMatterAfter = /^([\s\S]+?)\n(-{3,}|;{3,})(?:$|\n([\s\S]*)$)/;

enum SCHEMA {
  FAILSAFE_SCHEMA = "FAILSAFE_SCHEMA",
  JSON_SCHEMA = "JSON_SCHEMA",
  CORE_SCHEMA = "CORE_SCHEMA",
  DEFAULT_SAFE_SCHEMA = "DEFAULT_SAFE_SCHEMA",
  DEFAULT_FULL_SCHEMA = "DEFAULT_FULL_SCHEMA",
}

/**
 * @interface js-yaml `safeLoad()` 的参数
 */
interface ILoadOption {
  /* (default: null) - string to be used as a file path in error/warning messages. */
  filename?: string | null;
  /* (default: null) - function to call on warning messages. Loader will call this function with an instance of YAMLException for each warning. */
  onWarning?: () => {} | null;
  /* (default: DEFAULT_SAFE_SCHEMA) - specifies a schema to use. */
  schema?: SCHEMA;
  /* (default: false) - compatibility with JSON.parse behaviour. If true, then duplicate keys in a mapping will override values rather than throwing an error. */
  json?: boolean;
}

/**
 * @interface js-yaml `safeDump()` 的参数
 */
interface IDumpOption {
  /* (default: 2) - indentation width to use (in spaces). */
  indent: number;
  /* (default: false) - when true, will not add an indentation level to array elements */
  noArrayIndent: boolean;
  /* (default: false) - do not throw on invalid types (like function in the safe schema) and skip pairs and single values with such types. */
  skipInvalid: boolean;
  /* (default: -1) - specifies level of nesting, when to switch from block to flow style for collections. -1 means block style everwhere */
  flowLevel: number;
  /* - "tag" => "style" map. Each tag may have own set of styles. */
  styles: string;
  /* (default: DEFAULT_SAFE_SCHEMA) specifies a schema to use. */
  schema: SCHEMA;
  /* (default: false) - if true, sort keys when dumping YAML. If a function, use the function to sort the keys. */
  sortKeys: boolean;
  /* (default: 80) - set max line width. */
  lineWidth: number;
  /* (default: false) - if true, don't convert duplicate objects into references */
  noRefs: boolean;
  /* (default: false) - if true don't try to be compatible with older yaml versions. Currently: don't quote "yes", "no" and so on, as required for YAML 1.1 */
  noCompatMode: boolean;
  /* (default: false) - if true flow sequences will be condensed, omitting the space between a, b. Eg. '[a,b]', and omitting the space between key: value and quoting the key. Eg. '{"a":b}' Can be useful when using yaml for pretty URL query params as spaces are %-encoded. */
  condenseFlow: boolean;
}

/**
 * @interface 存放待导入或待导出 Markdown 文件的结构
 */
export interface ISpilt {
  data?: string | IDocumentFrontMatter; // 属性信息
  prefix?: boolean; // 是否在内容之前
  content: string; // 文章内容
  separator?: string; // "---" | ";;;"，根据分隔符区别 YAML 和 JSON
}

const doubleDigit = (num: number) => {
  return num < 10 ? `0${num}` : num;
};

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${doubleDigit(date.getMonth() + 1)}-${doubleDigit(
    date.getDate()
  )} ${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}:${doubleDigit(
    date.getSeconds()
  )}`;
};

const escapeYAML = (str: string) => {
  return str.replace(/\n(\t+)/g, (tabs) => {
    let result = "\n";
    for (let i = 0, len = tabs.length; i < len; i += 1) {
      result += "  ";
    }
    return result;
  });
};

/**
 * 将 YAML 字符串解析为 JS 对象
 * @param str 字符串
 * @param options js-yaml 选项
 */
const parseYAML = (str: string, options?: ILoadOption): IDocumentFrontMatter | null => {
  const result = yaml.load(escapeYAML(str), options);
  if (typeof result !== "object") return null;
  return result;
};

/**
 * 将 JSON 字符串解析为 JS 对象
 * @param str 字符串
 */
const parseJSON = (str: string): IDocumentFrontMatter | null => {
  try {
    return JSON.parse(`{${str}}`);
  } catch (err) {
    return null;
  }
};

/**
 * 转换 JS 对象为 YAML 字符串，先处理数据对象，再处理时间，最后加上空键
 * @param obj 数据对象
 * @param options `dump()` 选项
 */
const stringifyYAML = (obj: { [index: string]: any }, options?: IDumpOption): string => {
  const data: { [index: string]: any } = {};
  const nullKeys = [];
  const dateKeys = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      nullKeys.push(key);
    } else if (value instanceof Date) {
      dateKeys.push(key);
    } else {
      data[key] = value;
    }
  }

  let result = yaml.dump(data, options);

  if (dateKeys.length) {
    dateKeys.forEach((item) => {
      result += `${item}: ${formatDate(obj[item])}\n`;
    });
  }

  if (nullKeys.length) {
    nullKeys.forEach((item) => {
      result += `${item}:\n`;
    });
  }

  return result;
};

/**
 * 转换 JS 对象为 JSON 字符串
 * @param obj 数据对象
 */
const stringifyJSON = (obj: Object): string => {
  return JSON.stringify(obj, null, "  ")
    .replace(/\n {2}/g, () => "\n")
    .replace(/^{\n|}$/g, "");
};

/**
 * 使用正则的方法，分离 Markdown 文件字符串
 * @param str 文件总的字符串
 */
const split = (str: string): ISpilt => {
  if (rFrontMatterBefore.test(str)) {
    let match = str.match(rFrontMatterBefore);
    match = match as RegExpMatchArray;

    return {
      data: match[2],
      content: match[3],
      separator: match[1],
      prefix: true,
    };
  }

  // FIX 修复 front-matter 出现在中间，尤其是代码中的错误
  if (rFrontMatterAfter.test(str)) {
    let match = str.match(rFrontMatterAfter);
    match = match as RegExpMatchArray;

    return {
      data: match[1],
      content: match[3],
      separator: match[2],
      prefix: false,
    };
  }

  return { content: str };
};

/**
 * 解析字符串属性信息为对象
 * @param str 文件总的字符串
 * @param options js-yaml 的参数
 */
export function importFrontMatter(str: string, options?: ILoadOption): ISpilt {
  const splitData = split(str);
  if (!splitData.data) {
    return splitData;
  }

  const raw = splitData.data as string;
  const sep = splitData.separator as string;

  if (sep[0] === ";") {
    return {
      data: parseJSON(raw) || "",
      ...splitData,
    };
  } else {
    return {
      data: parseYAML(raw, options) || "",
      ...splitData,
    };
  }
}

/**
 * 将 Front-Matter 对象和文字内容格式化为字符串
 * @param payload 对象
 * @param options 选项
 */
export function exportFrontMatter(payload: ISpilt, options?: IDumpOption) {
  const content = payload.content;
  delete payload.content;

  if (!Object.keys(payload).length) return content;

  const data = payload.data as Object;
  const prefix = payload.prefix;
  const separator = payload.separator as string;

  let result = "";

  if (prefix) {
    result += `${separator}\n`;
  } else {
    result += `${content}\n${separator}\n`;
  }

  if (separator[0] === "-") {
    result += stringifyYAML(data, options);
  } else {
    result += stringifyJSON(data);
  }

  if (prefix) {
    result += `${separator}\n${content}`;
  }

  return result;
}

/**
 * 将解析得到的属性信息合并入 Doc
 * @param payload JS 对象属性信息
 */
export const metaInfo2Doc = (payload: ISpilt): IDocument => {
  const data = payload.data as IDocumentFrontMatter;
  return {
    ...data,
    content: payload.content,
  };
};
