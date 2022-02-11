import { createI18n } from "vue-i18n";
import { SYSTEM_LOCALE } from "@/shared/constant";

export const i18n = createI18n({
  legacy: false,
  locale: SYSTEM_LOCALE.ZH_CN,
  messages: {},
});
