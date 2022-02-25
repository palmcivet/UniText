import { ISchema, IGroup, reduceSchema } from "./_";
import { ITheme, IThemeCustom, IThemeOverview } from "@/shared/typings/setting/theme";

const tOverview: IGroup<IThemeOverview> = {
  type: "Group",
  title: ["主题样式"],
  properties: {
    dynamic: {
      type: "CheckBox",
      title: ["动态主题"],
      description: ["是否启用动态主题"],
      default: false,
    },
    preset: {
      type: "TextBox",
      title: ["预设主题"],
      description: [""],
      default: "OneDarkPro",
    },
  },
  default: {},
  description: [""],
};

const tCustom: IGroup<IThemeCustom> = {
  type: "Group",
  title: ["自定义"],
  properties: {
    appStyle: {
      type: "TextBox",
      title: ["外观主题"],
      description: ["外观的默认主题"],
      default: "",
    },
    monacoEditor: {
      type: "TextBox",
      title: ["编辑器主题"],
      description: ["Monaco 编辑器的主题"],
      default: "",
    },
    articleCode: {
      type: "TextBox",
      title: ["渲染代码主题"],
      description: ["渲染代码主题"],
      default: "",
    },
    articleBody: {
      type: "TextBox",
      title: ["渲染文章主题"],
      description: ["渲染文章主题"],
      default: "",
    },
  },
  default: {},
  description: [""],
};

export const schemaTheme: ISchema<ITheme> = {
  overview: tOverview,
  custom: tCustom,
};

export default reduceSchema(schemaTheme);
