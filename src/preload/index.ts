import { IPC_CHANNEL } from "@/shared/channel";
import { shell, clipboard, ipcRenderer, contextBridge } from "electron";

const _ipcRenderer = {
  invoke: (channel: string, ...args: any) => ipcRenderer.invoke(channel, ...args),
  on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener);
    return _ipcRenderer;
  },
  once: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.once(channel, listener);
    return _ipcRenderer;
  },
  postMessage: (channel: string, message: any, transfers: MessagePort[] | undefined) =>
    ipcRenderer.postMessage(channel, message, transfers),
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
    return _ipcRenderer;
  },
  removeListener: (channel: string, listener: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, listener);
    return _ipcRenderer;
  },
  send: (channel: string, ...args: any) => ipcRenderer.send(channel, ...args),
  sendSync: (channel: string, ...args: any) => ipcRenderer.sendSync(channel, ...args),
  sendTo: (id: number, channel: string, ...args: any) => ipcRenderer.sendTo(id, channel, ...args),
  sendToHost: (channel: string, ...args: any) => ipcRenderer.sendToHost(channel, args),
  // event emitter methods
  setMaxListeners: (n: number) => {
    ipcRenderer.setMaxListeners(n);
    return _ipcRenderer;
  },
  getMaxListeners: () => ipcRenderer.getMaxListeners(),
  listeners: (e: string | symbol) => ipcRenderer.listeners(e),
  rawListeners: (e: string | symbol) => ipcRenderer.rawListeners(e),
  emit: (e: string | symbol, ...args: any) => ipcRenderer.emit(e, ...args),
  listenerCount: (e: string | symbol) => ipcRenderer.listenerCount(e),
  addListener: (e: string | symbol, l: (...args: any[]) => void) => {
    ipcRenderer.addListener(e, l);
    return _ipcRenderer;
  },
  off: (e: string | symbol, l: (...args: any[]) => void) => {
    ipcRenderer.off(e, l);
    return _ipcRenderer;
  },

  prependListener: (e: string | symbol, l: (...args: any[]) => void) => {
    ipcRenderer.prependListener(e, l);
    return _ipcRenderer;
  },
  prependOnceListener: (e: string | symbol, l: (...args: any[]) => void) => {
    ipcRenderer.prependOnceListener(e, l);
    return _ipcRenderer;
  },
  eventNames: () => ipcRenderer.eventNames(),
};

const _dialog = {
  showCertificateTrustDialog(...options: any[]) {
    return ipcRenderer.invoke("dialog:show-certificate-trust-dialog", ...options);
  },
  showErrorBox(...options: any[]) {
    return ipcRenderer.invoke("dialog:show-error-box", ...options);
  },
  showMessageBox(...options: any[]) {
    return ipcRenderer.invoke("dialog:show-message-box", ...options);
  },
  showOpenDialog(...options: any[]) {
    return ipcRenderer.invoke("dialog:show-open-dialog", ...options);
  },
  showSaveDialog(...options: any[]) {
    return ipcRenderer.invoke("dialog:show-save-dialog", ...options);
  },
};

const _disk = {
  readDirectory(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_READ_DIRECTORY, ...args);
  },
  readTextFile(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_READ_TEXT_FILE, ...args);
  },
  readBinaryFile(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_READ_BINARY_FILE, ...args);
  },
  writeFile(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_WRITE_FILE, ...args);
  },
  delete(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_DELETE, ...args);
  },
  createFile(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_CREATE_FILE, ...args);
  },
  createDirectory(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_CREATE_DIRECTORY, ...args);
  },
  move(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_MOVE, ...args);
  },
  copy(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_COPY, ...args);
  },
  stat(...args: any[]) {
    return ipcRenderer.invoke(IPC_CHANNEL.DISK_STAT, ...args);
  },
};

const _electron = {
  shell,
  clipboard,
  ipcRenderer: _ipcRenderer,
  dialog: _dialog,
};

try {
  contextBridge.exposeInMainWorld("electron", _electron);
  contextBridge.exposeInMainWorld("disk", _disk);
} catch {
  (window as any).electron = _electron;
  (window as any).disk = _disk;
}

export type TPreloadDisk = typeof _disk;
