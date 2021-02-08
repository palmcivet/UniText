import striptags from "striptags";

import { BLANK_PATTERN } from "@/renderer/utils";

const _CN_PATTERN = /[\u4E00-\u9FA5]/g;
const _EN_PATTERN = /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;

function _countContent(content: string): [number, number] {
  if (typeof content !== "string") {
    throw new Error("[word-counter] content must be string type");
  }
  let cn = 0;
  let en = 0;
  if (content.length > 0) {
    const res = striptags(content);
    cn = (res.match(_CN_PATTERN) || []).length;
    en = (res.replace(_CN_PATTERN, "").match(_EN_PATTERN) || []).length;
  }
  return [cn, en];
}

export function charCount(content: string) {
  return content.length - (content.match(BLANK_PATTERN) || []).length;
}

export function wordCount(content: string) {
  const [cn, en] = _countContent(content);
  return cn + en;
}

export function timeCalc(content: string, cn: number = 300, en: number = 60) {
  const [cnCount, enCount] = _countContent(content);
  const time = cnCount / cn + enCount / en;
  const minius = time === 0 ? 0 : Math.ceil(time);
  return Math.floor(minius * 60);
}
