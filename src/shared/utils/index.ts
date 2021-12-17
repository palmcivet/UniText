/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
import crypto from "crypto";

export function debounce(fn: Function, delay: number = 200) {
  let timeout: NodeJS.Timeout | null;
  return function (this: any, ...args: Array<any>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
      timeout = null;
    }, delay);
  };
}

export function throttle(fn: Function, delay: number = 200): Function {
  let canRun = true;
  return function (this: any, ...args: Array<any>) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, args);
      canRun = true;
    }, delay);
  };
}

export const $ = (q: string) => document.querySelector(q) as HTMLElement;

export const $id = (q: string) => document.getElementById(q) as HTMLElement;

export const objectHasKeys = (obj: object) => Object.keys(obj).length > 0;

export const arrayHasElements = (arr: Array<any>) => arr.length !== 0;

export const cloneObj = (obj: object, deepCopy = true) => {
  return deepCopy ? JSON.parse(JSON.stringify(obj)) : Object.assign({}, obj);
};

export const deepGet = (object: any, path: string) => {
  const keys = path.split(".");
  let result = object;

  for (let idx = 0, key = keys[idx]; idx < keys.length; idx++, key = keys[idx]) {
    result = result[key];
    if (!result) {
      return result;
    }
  }

  return result;
};

export function hashBinary(content: crypto.BinaryLike): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

export function hashString(content: string): string {
  return crypto.createHash("md5").update(content, "utf8").digest("hex");
}

export function formatDate(raw: Date) {
  const doubleDigit = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return `${raw.getFullYear()}.${doubleDigit(raw.getMonth() + 1)}.${doubleDigit(raw.getDate())} ${doubleDigit(
    raw.getHours()
  )}:${doubleDigit(raw.getMinutes())}`;
}

export function union<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a, ...b]);
}

export function intersect<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => b.has(x)));
}

export function difference<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => !b.has(x)));
}
