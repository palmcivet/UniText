export const INJECTIONS_SYMBOL = Symbol("__injections__");

export type TKeyService =
  | "EnvService"
  | "MenuService"
  | "ImageService"
  | "WindowService"
  | "SettingService"
  | "KeybindingService";