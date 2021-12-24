import { ISchema, IGroup, reduceSchema } from "./_";
import { ITheme, IThemeColor } from "@/shared/typings/setting/theme";

const tColor: IGroup<IThemeColor> = {
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
      title: ["预设"],
      description: ["预设主题"],
      default: "OneDarkPro",
    },
    appearance: {
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
    renderCode: {
      type: "TextBox",
      title: ["渲染代码主题"],
      description: ["渲染代码主题"],
      default: "",
    },
    renderView: {
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
  color: tColor,
};

export default reduceSchema(schemaTheme);
