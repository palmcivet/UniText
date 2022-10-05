import { App } from "vue";
import { EventBus } from "@palmcivet/unitext-tree-view";

import { i18n } from "@/renderer/i18n";
import useGeneral from "@/renderer/stores/general";
import { useService } from "@/renderer/composables";
import Viewer from "@/renderer/models/model-viewer";
import Browser from "@/renderer/models/model-browser";
import Workbench from "@/renderer/models/model-workbench";
import ThemeEngine from "@/renderer/models/engine-theme";
import MarkdownEngine from "@/renderer/models/engine-markdown";
import { ISetting } from "@/shared/typings/setting";
import { BUS_CHANNEL } from "@/shared/channel";

const _bus = new EventBus();
const _viewer = new Viewer(_bus);
const _browser = new Browser(_bus);
const _workbench = new Workbench(_bus);
const _themeEngine = new ThemeEngine(_bus);
const _markdownEngine = new MarkdownEngine(_bus);

async function register() {
  const allSetting = useService("SettingService").getAll() as unknown;
  const all = (await allSetting) as ISetting;

  /* 更改 renderer locale */
  await useService("LanguageService").setLocale(all.system.launch.language);
  const messages = await useService("LanguageService").getLocaleMessages();
  Object.entries(messages).forEach(([locale, message]) => {
    i18n.global.setLocaleMessage(locale, message);
  });
  i18n.global.locale.value = all.system.launch.language;

  /* 注入 IGeneralState（即 IPreference） */
  useGeneral().FILL_STORE(all.preference);

  const { browser } = all.preference;

  _browser.update({ ...browser, cabinPath: all.system.launch.cabinPath });
  _workbench.update();
  _themeEngine.update(all.theme);
  _markdownEngine.update(all.markdown);
}

/* 将配置注入 model */
export default function createModel() {
  return {
    invoke(app: App) {
      app.provide("$bus", _bus);
      app.provide("$viewer", _viewer);
      app.provide("$browser", _browser);
      app.provide("$workbench", _workbench);
      app.provide("$theme", _themeEngine);
      _bus.on(BUS_CHANNEL.UPDATE_SETTING, register);
      return register();
    },
    dispose() {
      _bus.off(BUS_CHANNEL.UPDATE_SETTING, register);
    },
  };
}
