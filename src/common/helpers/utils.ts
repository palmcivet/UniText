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

export const updateStyle = (selector: string) =>
  (document.querySelector(selector) as HTMLElement).style;
