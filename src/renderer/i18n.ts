import { createI18n } from "vue-i18n";
import { TLocale } from "@/shared/typings/setting";

export const i18n = createI18n({
  legacy: false,
  locale: "ZH_CN" as TLocale,
  messages: {},
});
