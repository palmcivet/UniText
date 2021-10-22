import { IServiceMap } from "@/main/service/index";
import { useIpc } from "./electron";
import { toRaw } from "vue";

const { invoke } = useIpc();

function createProxy(service: string) {
  return new Proxy({} as any, {
    get(_, functionName) {
      return (...payloads: any[]) => {
        const rawPayloads = payloads.map((e) => toRaw(e));
        return invoke("service:call", service, functionName as string, ...rawPayloads);
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
