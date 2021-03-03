import path from "path";
import * as fse from "fs-extra";

const _IGNORE = [".DS_Store"];

/**
 * 检测 `item` 字符串是否在 `samp` 列表中
 * @param item 目标字符串
 * @param samp 字符串列表
 * @return `true`: 存在; `false`: 不存在
 */
// TODO samp.includes(item)
export const checkStringExist = (item: string, samp: Array<string>) =>
  samp.indexOf(item) !== -1;

export const joinPath = (...args: Array<string>) => path.join(...args);

/**
 * 检测 `base` 路径下，是否具有 `samp` 中的文件
 * @param base 路径
 * @param samp 文件列表
 */
export const checkFilesExist = async (base: string, samp: Array<string>) => {
  let flag = true;
  for await (const item of samp) {
    if (checkStringExist(item, _IGNORE)) return;
    flag = await fse.pathExists(joinPath(base, item));
    if (!flag) break;
  }
  return flag;
};

export const exists = async (p: string) => {
  try {
    await fse.access(p);
    return true;
  } catch (_) {
    return false;
  }
};

export const create = (pathname: string, type: "directory" | "file") => {
  if (type === "directory") {
    return fse.ensureDir(pathname);
  } else {
    return fse.outputFile(pathname, "");
  }
};

export const paste = (src: string, dest: string, type: "cut" | "copy") => {
  return type === "cut" ? fse.move(src, dest) : fse.copy(src, dest);
};

export const rename = (src: string, dest: string) => {
  return fse.move(src, dest);
};

export const deleteall = (path: string) => {
  var files = [];
  if (fse.existsSync(path)) {
    files = fse.readdirSync(path);
    files.forEach((file) => {
      var curPath = path + "/" + file;
      if (fse.statSync(curPath).isDirectory()) {
        deleteall(curPath);
      } else {
        fse.unlinkSync(curPath);
      }
    });
    fse.rmdirSync(path);
  }
};
