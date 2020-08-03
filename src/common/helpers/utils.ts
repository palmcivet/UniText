/**
 * Add single-quoted to string type field, in order to be compatible with many special characters
 * eg. true, false, 1, [, ], {, }, ,, #, <, >, @,
 */
export function formatYamlString(string: any) {
  return string.replace(/'/g, "''");
}

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
