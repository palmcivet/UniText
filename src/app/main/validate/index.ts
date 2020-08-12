import Ajv from "ajv";
import settingSchema from "./setting.json";

const varify = new Ajv({
  allErrors: true,
  useDefaults: true,
  strictNumbers: true,
  strictKeywords: true,
}).compile(settingSchema);

export const validateJson = (config: any) => {
  varify(config);
  return varify.errors;
};
