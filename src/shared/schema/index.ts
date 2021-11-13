import propertiesTheme from "./theme";
import propertiesSystem from "./system";
import propertiesMarkdown from "./markdown";
import propertiesPreference from "./preference";

export default {
  theme: {
    type: "object",
    properties: propertiesTheme,
    default: {},
  },
  system: {
    type: "object",
    properties: propertiesSystem,
    default: {},
  },
  markdown: {
    type: "object",
    properties: propertiesMarkdown,
    default: {},
  },
  preference: {
    type: "object",
    properties: propertiesPreference,
    default: {},
  },
  snippet: {},
  keybinding: {},
};
