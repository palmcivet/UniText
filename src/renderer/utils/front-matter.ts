/**
 * GitHub: https://github.com/hexojs/hexo-front-matter
 * GitHub: https://github.com/nodeca/js-yaml
 * 源码来自 hexo-front-matter，为其添加类型，修改为 TS 版本
 * 使用的依赖为 js-yaml
 */

const yaml = require("js-yaml");

import { formatDate } from "@/common/utils";
import { BLANK_PATTERN } from "@/renderer/utils";
import { IDocumentFrontMatter } from "@/typings/document";

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
   * @field 取值：`---` | `;;;`，根据分隔符区别 YAML 和 JSON
   */
  sep?: string;
  /**
   * @field 属性信息
   */
  data?: IDocumentFrontMatter;
  /**
   * @field 是否在内容之前
   */
  prefix?: boolean;
  /**
   * @field 文章内容
   */
  content: string;
}

const escapeYAML = (str: string) => {
  return str.replace(BLANK_PATTERN, (tabs) => {
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
const parseYAML = (
  str: string,
  options?: ILoadOption
): IDocumentFrontMatter | undefined => {
  const result = yaml.load(escapeYAML(str), options);
  if (typeof result !== "object") return undefined;
  return result;
};

/**
 * 将 JSON 字符串解析为 JS 对象
 * @param str 字符串
 */
const parseJSON = (str: string): IDocumentFrontMatter | undefined => {
  try {
    return JSON.parse(`{${str}}`);
  } catch (err) {
    return undefined;
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

  let result = yaml.dump(data, {
    quotingType: "",
  });

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
    .replace(/\n{2}/g, () => "\n")
    .replace(/^{\n}$/g, "");
};

/**
 * 解析字符串属性信息为对象
 * @param str 文件总的字符串
 * @param options js-yaml 的参数
 */
export function importFrontMatter(str: string, options?: ILoadOption): ISpiltStructure {
  if (!FRONT_MATTER.test(str)) return { content: str };

  const match = str.match(FRONT_MATTER) as RegExpMatchArray;

  const sep = match[1];
  const data = match[2];

  const splitData = {
    sep,
    data,
    content: match[3],
    prefix: true,
  };

  if (data.replaceAll(BLANK_PATTERN, "") === "") {
    return {
      ...splitData,
      data: undefined,
    };
  }

  if (sep[0] === ";") {
    return {
      ...splitData,
      data: parseJSON(data),
    };
  } else {
    return {
      ...splitData,
      data: parseYAML(data, options),
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
  const sep = payload.sep as string;
  const data = payload.data as Object;
  const prefix = payload.prefix;

  let result = "";

  if (prefix) {
    result += `${sep}\n`;
  } else {
    result += `${content}\n${sep}\n`;
  }

  if (sep[0] === "-") {
    result += stringifyYAML(data, options);
  } else {
    result += stringifyJSON(data);
  }

  if (prefix) {
    result += `${sep}\n${content}`;
  }

  return result;
}
