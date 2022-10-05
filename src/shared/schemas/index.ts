import propertiesTheme from "./schema-theme";
import propertiesSystem from "./schema-system";
import propertiesMarkdown from "./schema-markdown";
import propertiesPreference from "./schema-preference";

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
