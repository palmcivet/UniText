import { join } from "path";
import * as fse from "fs-extra";

/**
 * 递归删除
 * @param dir 路径
 */
export function deleteAll(dir: string) {
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
}
