import { lang } from "@/main/backend/Locale";
import Keybinding from "@/main/service/KeybindingService";

export default (keybinding: Keybinding): TMenuTemplate => [
  {
    label: lang("dock.new-window"),
    accelerator: keybinding.get("dock.new-window"),
  },
  {
    label: lang("dock.new-note"),
    accelerator: keybinding.get("dock.new-note"),
    click: () => {},
  },
  {
    label: lang("dock.new-agenda"),
    accelerator: keybinding.get("dock.new-agenda"),
    click: () => {},
  },
];
