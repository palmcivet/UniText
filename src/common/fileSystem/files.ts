import path from "path";

export const joinPath = (...args: Array<string>) => path.normalize(path.join(...args));
