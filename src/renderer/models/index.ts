import { App } from "vue";
import { EventBus } from "@palmcivet/unitext-tree-view";

import useGeneral from "@/renderer/stores/general";
import { useService } from "@/renderer/composables/service";
import { ISetting } from "@/shared/typings/setting";
import Browser from "./Browser";
import Workbench from "./Workbench";
import ThemeEngine from "./ThemeEngine";
import MarkdownEngine from "./MarkdownEngine";
import { BUS_CHANNEL } from "@/shared/channel";

const _bus = new EventBus();
const _browser = new Browser(_bus);
const _workbench = new Workbench(_bus);
// const _themeEngine = new ThemeEngine(_bus);
// const _markdownEngine = new MarkdownEngine(_bus);

(window as any).stack = _workbench;

async function register() {
  const allSetting = useService("SettingService").getAll() as unknown;
  const all = (await allSetting) as ISetting;

  /* 注入 IGeneralState（即 IPreference） */
  useGeneral().FILL_STORE(all.preference);

  const { browser } = all.preference;

  _browser.update({ ...browser, cabinPath: all.system.launch.cabinPath });
}

/* 将配置注入 model */
export default function useModel() {
  return {
    invoke(app: App) {
      app.provide("$bus", _bus);
      app.provide("$browser", _browser);
      app.provide("$workbench", _workbench);
      // app.provide("$theme", _themeEngine);
      // app.provide("$markdown", _markdownEngine);
      _bus.on(BUS_CHANNEL.UPDATE_SETTING, register);
      return register();
    },
    dispose() {
      _bus.off(BUS_CHANNEL.UPDATE_SETTING, register);
    },
  };
}
