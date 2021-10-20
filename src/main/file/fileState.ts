import { join } from "path";
import * as fse from "fs-extra";
import * as https from "https";

import { ITree, ITreeNode } from "@/typings/vuex/sideBar";

export const fetchHttpFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const file = fse.createWriteStream(dest);

        res.on("end", () => {
          resolve();
        });

        res.on("error", (err) => {
          fse.unlink(dest);
          reject(err);
        });

        res.pipe(file);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
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
  fse.readdir(join(base, path)).then((res) =>
    res.forEach((item, idx) => {
      if (ignore.indexOf(item) !== -1) return;

      const isDir = fse.lstatSync(join(base, path, item)).isDirectory();

      const subTree: ITreeNode = {
        icon: "",
        order: idx,
        children: isDir ? {} : false,
        collapse: true,
      };
      tree[item] = subTree;

      if (isDir) {
        buildTree(base, join(path, item), ignore, subTree.children as ITree);
      }
    })
  );
};
