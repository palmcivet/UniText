import { localesMenu } from "@/shared/i18n/ZH_CN";
import { deepGet } from "@/shared/utils";

type TKey = MapGet<typeof localesMenu>;

export const lang = (key: TKey): string => {
  return deepGet(localesMenu, key);
};
