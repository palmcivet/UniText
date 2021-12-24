import { ipcMain } from "electron";
import { join, basename } from "path";
import * as fse from "fs-extra";
import { ITreeNodeFile, ITreeNodeFolder } from "@palmcivet/unitext-tree-view";
import { deleteAll } from "@/main/utils/file";
import { IPathRoute } from "@/shared/typings/renderer";

/**
 * @description 读取文件夹。限文件树操作
 */
ipcMain.handle("disk:read-directory", (event, route: IPathRoute, ignore: Array<string> = []): ITreeNodeFolder => {
  const files: Array<ITreeNodeFile> = [];
  const folders: Array<ITreeNodeFolder> = [];
  const location = join(...route);

  fse.readdirSync(location).map((child) => {
    if (ignore.includes(child)) {
      return;
    }

    const childPath = join(location, child);

    if (fse.statSync(childPath).isDirectory()) {
      folders.push({
        label: basename(childPath),
        icon: "ri-markdown-line",
        collapsible: true,
        collapsed: true,
        loaded: false,
        files: [],
        folders: [],
      });
    } else {
      files.push({
        label: basename(childPath),
        icon: "ri-markdown-line",
        collapsible: false,
      });
    }
  });

  return {
    label: basename(location),
    icon: "ri-folder-2-line",
    collapsible: true,
    collapsed: true,
    loaded: true,
    folders,
    files,
  };
});

/**
 * @description 读取文本文件
 */
ipcMain.handle(
  "disk:read-text-file",
  async (
    event,
    route: IPathRoute,
    options?: { encoding?: BufferEncoding | string; flag?: string | undefined }
  ): Promise<string> => {
    const location = join(...route);
    return (
      await fse.readFile(location, {
        encoding: "utf8",
        ...options,
      })
    ).toString();
  }
);

/**
 * @description 读取二进制文件
 */
ipcMain.handle("disk:read-binary-file", async (event, route: IPathRoute): Promise<Buffer> => {
  const location = join(...route);
  return await fse.readFile(location);
});

/**
 * @description 保存文件
 */
ipcMain.handle(
  "disk:write-file",
  async (
    event,
    route: IPathRoute,
    data: any,
    options?: fse.WriteFileOptions | BufferEncoding | string
  ): Promise<void> => {
    const location = join(...route);
    await fse.writeFile(location, data, options);
  }
);

/**
 * @description 删除文件（夹）。递归
 */
ipcMain.handle("disk:delete", (event, routes: Array<IPathRoute>): void => {
  routes.forEach((route) => {
    const location = join(...route);
    deleteAll(location);
  });
});

/**
 * @description 创建文件。递归
 */
ipcMain.handle("disk:create-file", (event, route: IPathRoute, data = "") => {
  const location = join(...route);
  fse.outputFile(location, data);
});

/**
 * @description 创建文件夹。递归
 */
ipcMain.handle("disk:create-directory", (event, route: IPathRoute) => {
  const location = join(...route);
  fse.ensureDir(location);
});

/**
 * @description 移动。批量
 */
ipcMain.handle("disk:move", (event, srcRoutes: Array<IPathRoute>, dstRoute: IPathRoute) => {
  const dst = join(...dstRoute);
  srcRoutes.forEach((route) => {
    const src = join(...route);
    fse.move(src, dst);
  });
});

/**
 * @description 复制。批量
 */
ipcMain.handle("disk:copy", (event, srcRoutes: Array<IPathRoute>, dstRoute: IPathRoute) => {
  const dst = join(...dstRoute);
  srcRoutes.forEach((route) => {
    const src = join(...route);
    fse.copy(src, dst);
  });
});

/**
 * @description 复制。批量
 */
ipcMain.handle("disk:stat", (event, route: IPathRoute) => {
  const location = join(...route);
  return fse.stat(location);
});
