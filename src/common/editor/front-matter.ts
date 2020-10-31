/**
 * GitHub: https://github.com/hexojs/hexo-front-matter
 * GitHub: https://github.com/nodeca/js-yaml
 * 源码来自 hexo-front-matter，为其添加类型，修改为 TS 版本
 * 使用的依赖为 js-yaml
 */

const yaml = require("js-yaml");

import { IDocumentFrontMatter, IDocument } from "@/typings/document";
import { IGeneralStateEditor } from "@/typings/modules/general";
import { IFile } from "@/typings/modules/workBench";
import { formatDate } from "../utils";

const FRONT_MATTER = /^(-{3,}|;{3,})\n([\s\S]+?)\n\1(?:$|\n([\s\S]*)$)/;

/**
 * @type YAML 方案
 */
type SCHEMA =
  | "JSON_SCHEMA"
  | "CORE_SCHEMA"
  | "FAILSAFE_SCHEMA"
  | "DEFAULT_SAFE_SCHEMA"
  | "DEFAULT_FULL_SCHEMA";

/**
 * https://github.com/nodeca/js-yaml#safeload-string---options-
 * @interface js-yaml `safeLoad()` 的参数
 */
interface ILoadOption {
  filename?: string | null /* (default: null) */;
  onWarning?: () => {} | null /* (default: null) */;
  schema?: SCHEMA /* (default: DEFAULT_SAFE_SCHEMA) */;
  json?: boolean /* (default: false) */;
}

/**
 * https://github.com/nodeca/js-yaml#safedump-object---options-
 * @interface js-yaml `safeDump()` 的参数
 */
interface IDumpOption {
  indent: number /* (default: 2) */;
  noArrayIndent: boolean /* (default: false) */;
  skipInvalid: boolean /* (default: false) */;
  flowLevel: number /* (default: -1) */;
  styles: string /* "" */;
  schema: SCHEMA /* (default: DEFAULT_SAFE_SCHEMA) */;
  sortKeys: boolean /* (default: false) */;
  lineWidth: number /* (default: 80) */;
  noRefs: boolean /* (default: false) */;
  noCompatMode: boolean /* (default: false) */;
  condenseFlow: boolean /* (default: false) */;
}

/**
 * @interface 存放待导入或待导出 Markdown 文件的结构
 */
interface ISpiltStructure {
  /**
   * @field 属性信息
   */
  data?: string | IDocumentFrontMatter;
  /**
   * @field 是否在内容之前
   */
  prefix?: boolean;
  /**
   * @field 文章内容
   */
  content: string;
  /**
   * @field 取值：`---` | `;;;`，根据分隔符区别 YAML 和 JSON
   */
  separator?: string;
}

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
const split = (str: string): ISpiltStructure => {
  if (FRONT_MATTER.test(str)) {
    let match = str.match(FRONT_MATTER);
    match = match as RegExpMatchArray;

    return {
      data: match[2],
      content: match[3],
      separator: match[1],
      prefix: true,
    };
  }

  return { content: str };
};

/**
 * 解析字符串属性信息为对象
 * @param str 文件总的字符串
 * @param options js-yaml 的参数
 */
export function importFrontMatter(str: string, options?: ILoadOption): ISpiltStructure {
  const splitData = split(str);
  if (!splitData.data) {
    return splitData;
  }

  const data = splitData.data as string;
  const sep = splitData.separator as string;

  if (sep[0] === ";") {
    return {
      data: parseJSON(data) || "",
      ...splitData,
    };
  } else {
    return {
      data: parseYAML(data, options) || "",
      ...splitData,
    };
  }
}

/**
 * 将 Front-Matter 对象和文字内容格式化为字符串
 * @param payload 对象
 * @param options 选项
 */
export function exportFrontMatter(payload: ISpiltStructure, options?: IDumpOption) {
  const content = payload.content;

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
export const metaInfo2Doc = (payload: ISpiltStructure, doc: IFile): IDocument => {
  const data = payload.data as string;
  // TODO 校验 front-matter 完整性
  if (data === "") return doc;

  return {
    ...(parseYAML(data) as IDocumentFrontMatter),
    content: payload.content,
  };
};
