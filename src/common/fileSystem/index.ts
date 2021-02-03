import path from "path";
import * as fse from "fs-extra";

import { ITree, ITreeNode } from "@/typings/vuex/sideBar";

export const joinPath = (...args: Array<string>) => path.normalize(path.join(...args));

export const exists = async (p: string) => {
  try {
    await fse.access(p);
    return true;
  } catch (_) {
    return false;
  }
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
