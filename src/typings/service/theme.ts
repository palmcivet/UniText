import { editor } from "monaco-editor";

export enum ETitleBar {
  DEFAULT = "default",
  HIDDEN = "hidden",
  INSET = "hiddenInset",
  CUSTOM = "customButtonsOnHover",
}

export enum ESchema {
  SYSTEM = "SYSTEM",
  TIME = "TIME",
  PRESET = "PRESET",
  CUSTOM = "CUSTOM",
}

export interface IThemeWindow {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  titleBarStyle: ETitleBar;
}

export interface IThemeAppearance {
  schema: ESchema;
}

export interface IThemeEditor extends editor.IStandaloneThemeData {}

export interface IThemeView {}

export interface IThemeIcon {}
