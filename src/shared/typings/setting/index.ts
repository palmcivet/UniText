import { IPreference } from "./preference";
import { IMarkdown } from "./markdown";
import { ISnippet } from "./snippet";
import { ISystem } from "./system";
import { ITheme } from "./theme";

// TODO IXxxx 改为 ISettingXxxx

export interface ISetting {
  preference: IPreference;
  markdown: IMarkdown;
  system: ISystem;
  theme: ITheme;
  snippet: ISnippet;
}
