import { toRaw } from "vue";
import { useIpc } from "./electron";
import { IServiceMap } from "@/main/service/index";
import { IPC_CHANNEL } from "@/shared/channel";

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
