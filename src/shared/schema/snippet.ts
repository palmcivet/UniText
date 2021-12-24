import { IGroup, reduceSchema, ISchema } from "./_";
import { ISnippet } from "@/shared/typings/setting/snippet";

const template: IGroup<ISnippet> = {
  type: "Group",
  title: ["片段"],
  description: ["设置片段"],
  properties: {
    template: {
      type: "TextGroup",
      title: ["文档模板"],
      default: [],
      description: ["文档模板，创建时启用"],
    },
    fragment: {
      type: "TextGroup",
      title: ["代码片段"],
      default: [],
      description: ["代码片段，编辑时输入"],
    },
  },
  default: {},
};

export const schemaSnippet = template as unknown as ISchema<ISnippet>;

export default reduceSchema(schemaSnippet);
