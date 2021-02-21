import { TSchema, IGroup, reduceType, reduceSchema } from "@/main/utils/schema";
import { EWindowTitleBar, IThemeWindow, IThemeColor } from "@/typings/service/theme";
import { ITheme } from "@/typings/bootstrap";

const tWindow: IGroup<IThemeWindow> = {
  type: "Group",
  title: ["窗口样式"],
  description: [""],
  properties: {
    width: {
      type: "Range",
      title: ["宽度"],
      description: ["窗口的默认宽度"],
      minimum: 647,
      default: 1294,
    },
    height: {
      type: "Range",
      title: ["高度"],
      description: ["窗口的默认高度"],
      minimum: 400,
      default: 800,
    },
    titleBarStyle: {
      type: "DropDown",
      title: ["标题栏样式"],
      description: ["标题栏的默认样式"],
      enum: reduceType(EWindowTitleBar),
      default: EWindowTitleBar.HIDDEN,
    },
  },
  default: {},
};

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

export const schemaTheme: TSchema<ITheme> = {
  window: tWindow,
  color: tColor,
};

export default reduceSchema(schemaTheme);
