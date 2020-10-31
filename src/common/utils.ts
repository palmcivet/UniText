/* eslint-disable func-names */
import crypto from "crypto";

export function debounce(fn: Function, delay: number = 1000) {
  let timeout: NodeJS.Timeout | null;
  return function(this: any, ...args: Array<any>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
      timeout = null;
    }, delay);
  };
}

export function throttle(fn: Function, delay: number = 1000): Function {
  let canRun = true;
  return function(this: any, ...args: Array<any>) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, args);
      canRun = true;
    }, delay);
  };
}

export const $ = (q: string) => document.querySelector(q) as HTMLElement;

export const hasKeys = (obj: object) => Object.keys(obj).length > 0;

export const notEmpty = (arr: Array<any>) => arr.length !== 0;

export const cloneObj = (obj: object, deepCopy = true) => {
  return deepCopy ? JSON.parse(JSON.stringify(obj)) : Object.assign({}, obj);
};

export const hashCode = (plain: string) => {
  let hash = 0;
  let chr;
  for (let i = 0; i < plain.length; i += 1) {
    chr = plain.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString();
};

export const getHash = (
  content: string,
  encoding: crypto.Utf8AsciiLatin1Encoding,
  type: string
) => {
  return crypto
    .createHash(type)
    .update(content, encoding)
    .digest("hex");
};

export const getContentHash = (content: string) => {
  return getHash(content, "utf8", "sha1");
};

export const formatDate = (raw: Date) => {
  const doubleDigit = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return `${raw.getFullYear()}.${doubleDigit(raw.getMonth() + 1)}.${doubleDigit(
    raw.getDate()
  )} ${doubleDigit(raw.getHours())}:${doubleDigit(raw.getMinutes())}`;
};
