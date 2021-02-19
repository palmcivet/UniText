export type TSchema<T> = {
  [key in keyof T]: IGroup<T[key]>;
};

export const reduceType = (type: any) => {
  const resArr = [];
  for (let key in type) {
    resArr.push(type[key]);
  }
  return resArr;
};

export interface IGroup<T> {
  type: "Group";
  title: Array<string | Function>;
  properties: {
    [key in keyof T]: ITextBox | ITextGroup | ICheckBox | IRange | IDropDown;
  };
  default: { [key: string]: any };
  description: Array<string>;
}

export interface ITextBox {
  type: "TextBox";
  title: Array<string>;
  default: string;
  pattern?: string;
  description: Array<string>;
}

export interface ITextGroup {
  type: "TextGroup";
  title: Array<string>;
  default: Array<string>;
  description: Array<string>;
}

export interface ICheckBox {
  type: "CheckBox";
  title: Array<string>;
  default: boolean;
  description: Array<string>;
}

export interface IRange {
  type: "Range";
  title: Array<string>;
  maximum?: number;
  minimum?: number;
  default: number;
  description: Array<string>;
}

export interface IDropDown {
  type: "DropDown";
  title: Array<string>;
  enum: Array<any>;
  default: any;
  description: Array<string>;
}

export function reduceSchema<T>(data: TSchema<T>) {
  enum ETypeMap {
    Group = "object",
    Range = "number",
    CheckBox = "boolean",
    TextBox = "string",
    TextGroup = "array",
    DropDown = "string",
  }

  interface IObjAny {
    [i: string]: any;
  }

  const res: IObjAny = {};

  for (const key in data) {
    const element = data[key as keyof T];
    const properties: IObjAny = element.properties;

    const subProperties: IObjAny = {};

    for (const subKey in properties) {
      const subElement = properties[subKey];

      let value: IObjAny = {};

      switch (subElement.type) {
        case "Range":
          value = {
            type: ETypeMap.Range,
          };
          subElement.maximum && (value["maximum"] = subElement.maximum);
          subElement.minimum && (value["minimum"] = subElement.minimum);
          break;
        case "TextBox":
          value = {
            type: ETypeMap.TextBox,
          };
          subElement.pattern && (value["pattern"] = subElement.pattern);
          break;
        case "CheckBox":
          value = {
            type: ETypeMap.CheckBox,
          };
          break;
        case "TextGroup":
          value = {
            type: ETypeMap.TextGroup,
          };
          break;
        case "DropDown":
          value = {
            type: ETypeMap.DropDown,
            enum: subElement.enum,
          };
          break;
      }

      subProperties[subKey] = {
        default: subElement.default,
        ...value,
      };
    }

    res[key] = {
      type: "object",
      properties: subProperties,
      default: element.default,
    };
  }

  return res;
}
