import { EventBus } from "@palmcivet/unitext-tree-view";
import Browser from "./models/Browser";
import Workbench from "./models/Workbench";

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $bus: EventBus;
    $browser: Browser;
    $workbench: Workbench;
  }
}
