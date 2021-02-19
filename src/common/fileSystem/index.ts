import path from "path";
import * as fse from "fs-extra";

import { ITree, ITreeNode } from "@/typings/vuex/sideBar";

const _IGNORE = [".DS_Store"];

export const shouldIgnore = (item: string) => _IGNORE.indexOf(item) !== -1;

export const joinPath = (...args: Array<string>) => path.join(...args);

export const checkDir = async (base: string, samp: Array<string>) => {
  let flag = true;
  for await (const item of samp) {
    if (shouldIgnore(item)) return;
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

export const fetchFileInfo = async (path: string) => {
  const res = await fse.stat(path);

  return {
    createDate: res.birthtime,
    modifyDate: res.mtime,
  };
};

export const buildTree = (
  base: string,
  path: string,
  ignore: Array<string>,
  tree: ITree
) => {
  fse.readdir(joinPath(base, path)).then((res) =>
    res.forEach((item, idx) => {
      if (ignore.indexOf(item) !== -1) return;

      const isDir = fse.lstatSync(joinPath(base, path, item)).isDirectory();

      const subTree: ITreeNode = {
        icon: "",
        order: idx,
        children: isDir ? {} : false,
        collapse: true,
      };
      tree[item] = subTree;

      if (isDir) {
        buildTree(base, joinPath(path, item), ignore, subTree.children as ITree);
      }
    })
  );
};
