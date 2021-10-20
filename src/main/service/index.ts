import { ipcMain } from "electron";

import EnvService from "./EnvService";
import MenuService from "./MenuService";
import ImageService from "./ImageService";
import WindowService from "./WindowService";
import SettingService from "./SettingService";
import KeybindingService from "./KeybindingService";
import { INJECTIONS_SYMBOL, TKeyService } from "./_";

interface IInjection {
  type: string;
  field: string;
}

export interface IServiceMap {
  EnvService: EnvService;
  MenuService: MenuService;
  ImageService: ImageService;
  WindowService: WindowService;
  SettingService: SettingService;
  KeybindingService: KeybindingService;
}

class ServiceNotFoundError extends Error {
  constructor(readonly service: string) {
    super(`Cannot find service named ${service}!`);
  }
}

class ServiceMethodNotFoundError extends Error {
  constructor(readonly service: string, readonly method: string) {
    super(`Cannot find method named ${method} in service [${service}]!`);
  }
}

/**
 * Service 容器
 */
export default class Container {
  private hasInitialized: boolean;

  private readonly containerMap: Partial<IServiceMap>;

  constructor() {
    this.hasInitialized = false;
    this.containerMap = {};
  }

  public setService<K extends TKeyService>(id: K, value: any): void {
    this.containerMap[id] = value;
  }

  public getService<K extends TKeyService, V extends IServiceMap[K]>(id: K): V {
    return this.containerMap[id] as V;
  }

  public hasService<K extends TKeyService>(id: K): Boolean {
    return Object.keys(this.containerMap).includes(id);
  }

  public initService(): void {
    if (this.hasInitialized) {
      throw new Error("Should not initialize the services multiple time!");
    }

    /* 遍历 service，处理注入点 */
    Object.entries(this.containerMap).forEach(([id, service]) => {
      const targetPrototype = Object.getPrototypeOf(service);

      const injects: IInjection[] = targetPrototype[INJECTIONS_SYMBOL] || [];

      injects.forEach(({ type, field }) => {
        if (this.hasService(id as TKeyService)) {
          const success = Reflect.set(service, field, this.getService(type as TKeyService));
          if (!success) {
            throw new Error(`Cannot set service ${type} to ${targetPrototype}`);
          }
        } else {
          throw new Error(
            `Cannot find service named ${type}! Which is required by ${targetPrototype.constructor.name}`
          );
        }
      });
    });

    /* 监听 IPC 通信 */
    ipcMain.handle("service:call", (event, name: TKeyService, method: string, ...payloads: any[]) => {
      if (!this.hasService(name)) {
        throw new ServiceNotFoundError(name);
      }

      const service = this.getService(name) as { [K: string]: any };

      if (!service[method]) {
        throw new ServiceMethodNotFoundError(name, method);
      }

      return service[method](...payloads);
    });

    this.hasInitialized = true;
  }
}
