import Logger, { LoggerFacade } from "@/main/utils/logger";

export const INJECTIONS_SYMBOL = Symbol("__injections__");

export type IKeyService =
  | "EnvService"
  | "MenuService"
  | "ImageService"
  | "WindowService"
  | "SettingService"
  | "LanguageService"
  | "KeybindingService";

interface IService {
  name: string;
  bootstrap?: Function;
}

/**
 * Service 基类
 */
export default class Service implements IService {
  readonly name: string;

  private logger: LoggerFacade;

  /**
   * 注入日志收集器实例
   * @param logger 日志实例
   */
  constructor(logger: Logger) {
    this.name = Object.getPrototypeOf(this).constructor.name;
    this.logger = logger.createLoggerFor(this.name);
  }

  protected log(m: any, ...a: any[]): void {
    this.logger.log(`[${this.name}] ${m}`, ...a);
  }

  protected error(m: any, ...a: any[]): void {
    this.logger.error(`[${this.name}] ${m}`, ...a);
  }

  protected warn(m: any, ...a: any[]): void {
    this.logger.warn(`[${this.name}] ${m}`, ...a);
  }
}

/**
 * 装饰器，用于注入服务
 * @param name 服务名
 * @returns 注入函数
 */
export function Inject(name: IKeyService) {
  return (target: any, propertyKey: string) => {
    if (!Reflect.has(target, INJECTIONS_SYMBOL)) {
      Reflect.set(target, INJECTIONS_SYMBOL, []);
    }
    if (!name) {
      throw new Error(`Inject recieved type: ${name}!`);
    } else {
      Reflect.get(target, INJECTIONS_SYMBOL).push({ type: name, field: propertyKey });
    }
  };
}
