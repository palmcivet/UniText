import { EventBus } from "@palmcivet/unitext-tree-view";
import Viewer from "./models/Viewer";
import Browser from "./models/Browser";
import Workbench from "./models/Workbench";
import ThemeEngine from "./models/ThemeEngine";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $bus: EventBus;
    $viewer: Viewer;
    $browser: Browser;
    $workbench: Workbench;
    $theme: ThemeEngine;
  }
}
