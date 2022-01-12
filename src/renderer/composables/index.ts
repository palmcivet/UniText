import { toRaw } from "vue";
import Electron from "electron";

import { IServiceMap } from "@/main/service/index";
import { IPC_CHANNEL } from "@/shared/channel";

const { shell, clipboard, ipcRenderer, dialog } = (window as any).electron as typeof Electron;

function createProxy(service: string) {
  return new Proxy({} as any, {
    get(_, functionName) {
      return (...payloads: any[]) => {
        const rawPayloads = payloads.map((e) => toRaw(e));
        return useIpc().invoke(IPC_CHANNEL.SERVICE_CALL, service, functionName as string, ...rawPayloads);
      };
    },
  });
}

const servicesProxy: IServiceMap = new Proxy({} as any, {
  get(_, serviceName) {
    return createProxy(serviceName as string);
  },
});

export function useService<K extends keyof IServiceMap>(name: K): IServiceMap[K] {
  return servicesProxy[name];
}

export function useShell() {
  return shell;
}

export function useClipboard() {
  return clipboard;
}

export function useIpc() {
  return ipcRenderer;
}

export function useDialog() {
  return dialog;
}

export function useDisk() {
  return (window as any).disk;
}
