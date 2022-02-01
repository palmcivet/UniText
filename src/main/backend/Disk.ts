import * as fse from "fs-extra";
import { ipcMain } from "electron";
import { join, basename } from "path";
import { ITreeNodeFile, ITreeNodeFolder } from "@palmcivet/unitext-tree-view";
import { deleteAll } from "@/main/utils/file";
import { IPathRoute } from "@/shared/typings/renderer";
import { IPC_CHANNEL } from "@/shared/channel";

/**
 * @description 读取文件夹。限文件树操作
 */
ipcMain.handle(
  IPC_CHANNEL.DISK_READ_DIRECTORY,
  (event, route: IPathRoute, ignore: Array<string> = []): ITreeNodeFolder => {
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
  }
);

/**
 * @description 读取文本文件
 */
ipcMain.handle(
  IPC_CHANNEL.DISK_READ_TEXT_FILE,
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
ipcMain.handle(IPC_CHANNEL.DISK_READ_BINARY_FILE, async (event, route: IPathRoute): Promise<Buffer> => {
  const location = join(...route);
  return await fse.readFile(location);
});

/**
 * @description 保存文件
 */
ipcMain.handle(
  IPC_CHANNEL.DISK_WRITE_FILE,
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
ipcMain.handle(IPC_CHANNEL.DISK_DELETE, (event, routes: Array<IPathRoute>): void => {
  routes.forEach((route) => {
    const location = join(...route);
    deleteAll(location);
  });
});

/**
 * @description 创建文件。递归
 */
ipcMain.handle(IPC_CHANNEL.DISK_CREATE_FILE, (event, route: IPathRoute, data = "") => {
  const location = join(...route);
  fse.outputFile(location, data);
});

/**
 * @description 创建文件夹。递归
 */
ipcMain.handle(IPC_CHANNEL.DISK_CREATE_DIRECTORY, (event, route: IPathRoute) => {
  const location = join(...route);
  fse.ensureDir(location);
});

/**
 * @description 移动。批量
 */
ipcMain.handle(IPC_CHANNEL.DISK_MOVE, (event, srcRoutes: Array<IPathRoute>, dstRoute: IPathRoute) => {
  const dst = join(...dstRoute);
  srcRoutes.forEach((route) => {
    const src = join(...route);
    fse.move(src, dst);
  });
});

/**
 * @description 复制。批量
 */
ipcMain.handle(IPC_CHANNEL.DISK_COPY, (event, srcRoutes: Array<IPathRoute>, dstRoute: IPathRoute) => {
  const dst = join(...dstRoute);
  srcRoutes.forEach((route) => {
    const src = join(...route);
    fse.copy(src, dst);
  });
});

/**
 * @description 复制。批量
 */
ipcMain.handle(IPC_CHANNEL.DISK_STAT, (event, route: IPathRoute) => {
  const location = join(...route);
  return fse.stat(location);
});

/* 目录监视器 */

const _watchMap: { [key: string]: fse.FSWatcher } = {};

ipcMain.handle(IPC_CHANNEL.DISK_WATCHER_START, (event, route: IPathRoute, key: string) => {
  const location = join(...route);

  _watchMap[key] ||= fse.watch(
    location,
    {
      recursive: true,
    },
    (_event, filename) => {
      if (filename && _event === "change") {
        event.sender.send(IPC_CHANNEL.DISK_WATCHER_NOTIFY, key, filename);
      }
    }
  );
});

ipcMain.handle(IPC_CHANNEL.DISK_WATCHER_CLOSE, (event, key: string) => {
  _watchMap[key]?.close();
});
