import path from "path";
import * as fse from "fs-extra";

import { ITree, ITreeNode } from "@/typings/modules/sideBar";

export const joinPath = (...args: Array<string>) => path.normalize(path.join(...args));

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
