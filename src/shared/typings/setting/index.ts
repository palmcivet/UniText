import { IPreference } from "./preference";
import { IMarkdown } from "./markdown";
import { ISnippet } from "./snippet";
import { ISystem } from "./system";
import { ITheme } from "./theme";
import { TMessage } from "@/shared/locales/_";
import { SYSTEM_LOCALE } from "@/shared/constant";

export type TLocale = keyof typeof SYSTEM_LOCALE;
export type TLocaleMessage = Partial<Record<TLocale, TMessage>>;

// TODO IXxxx 改为 ISettingXxxx

export interface ISetting {
  preference: IPreference;
  markdown: IMarkdown;
  system: ISystem;
  theme: ITheme;
  snippet: ISnippet;
}
