import path from "path";

export const joinPath = (...args: string[]) => path.normalize(path.join(...args));
