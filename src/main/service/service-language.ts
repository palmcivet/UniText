import { createI18n, I18n } from "vue-i18n";

import Logger from "@/main/utils/logger";
import Service from "@/main/service/_";
import ZH_CN from "@/shared/locales/zh-cn";
import { TLocale, TLocaleMessage } from "@/shared/typings/setting";
import { SYSTEM_LOCALE } from "@/shared/constant";

export default class LanguageService extends Service {
  private _rawI18n: I18n<TLocaleMessage, {}, {}, "ZH_CN", true>;

  private get _i18n() {
    return this._rawI18n.global;
  }

  private _message: TLocaleMessage;

  constructor(logger: Logger) {
    super(logger);
    this._message = { ZH_CN };
    this._rawI18n = createI18n({
      legacy: true,
      locale: SYSTEM_LOCALE.ZH_CN,
      messages: this._message,
    });
  }

  private async _loadLocale(locale: TLocale) {
    const message = await import(`@/shared/locales/${locale}`);
    this._i18n.setLocaleMessage(locale, message.default);
    this._message[locale] = message.default;
  }

  public translate(path: string) {
    return this._rawI18n.global.t(path);
  }

  public getLocale(): TLocale {
    return this._rawI18n.global.locale;
  }

  public getLocaleMessages(): TLocaleMessage {
    return this._message;
  }

  public async setLocale(locale: TLocale): Promise<void> {
    // 如果是当前语言
    if (this._i18n.locale === locale) {
      return;
    }

    // 如果尚未加载语言
    if (this._message[locale] === undefined) {
      await this._loadLocale(locale);
    }

    this._i18n.locale = locale;
  }
}
