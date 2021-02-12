import { IGroup, reduceSchema, reduceType, TSchema } from "@/main/utils/schema";
import { IMarkdown } from "@/typings/bootstrap";
import {
  EPreset,
  IMarkdownHabit,
  IMarkdownExtend,
  IMarkdownFeature,
  ECodeBlocks,
} from "@/typings/service/markdown";

const base: IGroup<IMarkdownHabit> = {
  type: "Group",
  title: ["Markdown"],
  description: ["Markdown 语法的设置"],
  properties: {
    preset: {
      type: "DropDown",
      title: ["语法方案"],
      enum: reduceType(EPreset),
      default: EPreset.GFM,
      description: ["基础语法方案。可被单独设置覆盖"],
    },
    hardBreaks: {
      type: "CheckBox",
      title: ["是否启用硬换行"],
      default: true,
      description: [""],
    },
    linkify: {
      type: "CheckBox",
      title: ["自动探测可点击的地址"],
      default: true,
      description: [""],
    },
    codeBlocks: {
      type: "DropDown",
      enum: reduceType(ECodeBlocks),
      title: ["代码块"],
      default: true,
      description: [""],
    },
  },
  default: {},
};

// const extend: IGroup<IMarkdownExtend> = {
//   type: "Group",
//   title: ["扩展语法"],
//   description: ["Markdown 语法的设置"],
//   properties: {},
//   default: {},
// };

// const feature: IGroup<IMarkdownFeature> = {
//   type: "Group",
//   title: ["特性"],
//   description: ["Markdown 语法的设置"],
//   properties: {},
//   default: {},
// };

// export const schemaMarkdown: TSchema<IMarkdown> = {
//   base,
//   extend,
//   feature,
// };

// export default reduceSchema(schemaMarkdown);
