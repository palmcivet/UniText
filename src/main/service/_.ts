export const INJECTIONS_SYMBOL = Symbol("__injections__");

export type IKeyService =
  | "EnvService"
  | "MenuService"
  | "ImageService"
  | "WindowService"
  | "SettingService"
  | "LanguageService"
  | "KeybindingService";
