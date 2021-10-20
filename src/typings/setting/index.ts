import { IMarkdown } from "./markdown";
import { IPreference } from "./preference";
import { ISystem } from "./system";
import { ITheme } from "./theme";

export interface ISetting {
  markdown: IMarkdown;
  preference: IPreference;
  system: ISystem;
  theme: ITheme;
}
