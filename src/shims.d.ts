import { AllElectron } from "electron";
import { VueBus } from "./app/renderer/bus";

declare module "vue/types/vue" {
  interface Vue {
    readonly $electron: AllElectron;
    readonly $bus: typeof VueBus;
  }
}
