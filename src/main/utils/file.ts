import { join } from "path";
import * as fse from "fs-extra";

const IGNORE = [".DS_Store"];

/**
 * 检测 `base` 路径下，是否具有 `samp` 中的文件
 * @deprecated
 * @param base 路径
 * @param samp 文件列表
 */
export const hasFileList = async (base: string, samp: Array<string>) => {
  let flag = true;
  for await (const item of samp) {
    if (IGNORE.includes(item)) continue;
    flag = await fse.pathExists(join(base, item));
    if (!flag) break;
  }
  return flag;
};

/**
 * 递归删除
 * @param dir 路径
 */
export const deleteAll = (dir: string) => {
  if (!fse.existsSync(dir)) {
    return;
  }

  fse.readdirSync(dir).forEach((childPath) => {
    const curPath = join(dir, childPath);
    if (fse.statSync(curPath).isDirectory()) {
      deleteAll(curPath);
    } else {
      // TODO 移到废纸篓
      fse.unlinkSync(curPath);
    }
  });

  fse.rmdirSync(dir);
};
