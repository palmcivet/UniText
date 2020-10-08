import * as fse from "fs-extra";
import {
  ILogicTree,
  ILogicTreeItem,
  ICacheTree,
  ICacheTreeItem,
} from "@/interface/vuex/modules/sideBar";
import { joinPath } from "./files";
import { notEmpty } from "../utils";

/**
 * 对调用方而言是透明的，不应产生副作用
 * @class 文件管理
 */
export class FileManager {
  cacheTree: ICacheTree = {};

  logicTree: ILogicTree = [];

  iconMap: Map<string, string> = new Map();

  errReg!: Error;

  /**
   * 加载缓存文件树
   * @param path cache JSON 文件的绝对路径，需校验文件存在
   */
  async loadTree(path: string) {
    try {
      const res = await fse.readJSON(path);
      this.cacheTree = res;
    } catch (err) {
      this.errReg = err;
    }
  }

  /**
   * 加载图标映射表
   * @param path icon JSON 文件的绝对路径，需校验文件存在
   */
  async loadMap(path: string) {
    try {
      const res = await fse.readJSON(path);
      this.iconMap = res;
    } catch (err) {
      this.errReg = err;
    }
  }

  /**
   * 构建缓存文件树
   * @param base 根路径
   * @param path 相对路径
   * @param ignore 忽略文件列表
   * @param fileTree 根节点
   */
  buildCacheTree(
    base: string,
    path: string,
    ignore: Array<string>,
    fileTree: ICacheTree = this.cacheTree
  ) {
    fse.readdir(joinPath(base, path)).then((res) =>
      res.forEach((item, idx) => {
        if (ignore.indexOf(item) !== -1) return;
        const isDir = fse.lstatSync(joinPath(base, path, item)).isDirectory();
        const subTree: ICacheTreeItem = {
          child: {},
          cache: [],
          order: idx,
          isFold: true,
          isFile: !isDir,
        };
        fileTree[item] = subTree;

        if (isDir) {
          return this.buildCacheTree(base, joinPath(path, item), ignore, subTree.child);
        }
      })
    );
  }

  /**
   * 构建初级逻辑文件列表
   */
  buildLogicTree() {
    Object.keys(this.cacheTree).forEach((key) => {
      this.logicTree.push({
        icon: this.iconMap.get(key) as string,
        path: key,
        tier: 0,
        isFold: this.cacheTree[key].isFold,
        isFile: this.cacheTree[key].isFile,
      });
    });
  }

  /**
   * 折叠/收起文件夹
   * @param idx `logicTree` 的下标
   */
  toggleFolder(idx: number) {
    let target!: ICacheTreeItem;
    let pointer = this.cacheTree;
    const node = this.logicTree[idx];
    node.path.split("/").forEach((i) => {
      target = pointer[i];
      pointer = pointer[i].child;
    });

    if (target.isFold) {
      /* 执行打开操作 */
      let subList: Array<ILogicTreeItem> = [];
      if (notEmpty(target.cache)) {
        subList = target.cache;
      } else {
        Object.keys(target.child).forEach((key) => {
          subList.push({
            icon: this.iconMap.get(node.path) as string,
            path: joinPath(node.path, key),
            // tier: [node.tier[0] + 1, node.tier[1] + 1],
            tier: node.tier + 1,
            isFold: target.child[key].isFold,
            isFile: target.child[key].isFile,
          });
        });
      }
      this.logicTree = this.logicTree
        .slice(0, idx + 1)
        .concat(subList, this.logicTree.slice(idx + 1));
    } else {
      /* 执行关闭操作 */
      let index = idx + 1;
      for (index; index < this.logicTree.length; index++) {
        /**
         * - 归属值从 0 开始，越小，等级越低
         * - `=` 表示同级文件夹
         * - 从指定文件夹 `A` 开始遍历，遇到与 `A` 同一层级或比 `A` 层级更高的文件夹结束
         */
        if (this.logicTree[index].tier <= node.tier) {
          break;
        }
      }
      this.logicTree.splice(idx + 1, index - idx - 1);
    }

    target.isFold = !target.isFold;
    node.isFold = !node.isFold;

    // TODO 保存状态
  }

  /**
   * （伪）全部折叠
   * @param isOnce 是否只折叠一级文件夹
   */
  toggleAll(isOnce: boolean) {
    let t = this.cacheTree;
    if (isOnce) {
      for (const f in t) {
        t[f].isFold = true;
      }
    } else {
      // TODO traverse
    }
  }

  /**
   * 排序，`order` 取值：
   * - `-1` 字母逆序
   * - `1` 字母顺序
   * - `0` 自定义顺序
   * @param order 顺序
   */
  sortTree(order: -1 | 0 | 1 = 0) {
    switch (order) {
      case -1:
        break;
      case 0:
        break;
      case 1:
        break;
    }
  }

  /**
   * 保存文件树，需提供绝对路径
   * @param path 绝对路径
   */
  saveTree(path: string) {
    fse.writeJSON(path, this.cacheTree).then((res) => {
      return res;
    });
  }
}
