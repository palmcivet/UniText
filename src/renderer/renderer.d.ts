import { EventBus } from "@palmcivet/unitext-tree-view";
import Viewer from "./models/model-viewer";
import Browser from "./models/model-browser";
import Workbench from "./models/model-workbench";
import ThemeEngine from "./models/engine-theme";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $bus: EventBus;
    $viewer: Viewer;
    $browser: Browser;
    $workbench: Workbench;
    $theme: ThemeEngine;
  }
}
