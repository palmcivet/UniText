/* eslint-disable func-names */
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

export const $ = (q: string) => document.querySelector(q) as HTMLElement;

export function debounce(fn: Function, delay: number = 1000): Function {
  let timeout: any;
  return function(this: any, ...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
      timeout = undefined;
    }, delay);
  };
}

export function throttle(fn: Function, delay: number = 1000): Function {
  let canRun = true;
  return function(this: any, ...args: any[]) {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, args);
      canRun = true;
    }, delay);
  };
}
