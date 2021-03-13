import Keybinding from "@/common/userData/Keybinding";
import { localesMenu } from "@/common/i18n/iMenu";
import { TMenuTemplate } from "@/typings/main";
import { EI18n } from "@/typings/schema/preference";

export default (locale: EI18n, keybinding: Keybinding): TMenuTemplate => [
  {
    label: localesMenu.dock.newwindow[locale],
    accelerator: keybinding.getItem("dock.newwindow"),
  },
  {
    label: localesMenu.dock.newnote[locale],
    accelerator: keybinding.getItem("dock.newnote"),
    click: () => {},
  },
  {
    label: localesMenu.dock.newagenda[locale],
    accelerator: keybinding.getItem("dock.newagenda"),
    click: () => {},
  },
];
