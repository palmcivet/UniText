import { AllElectron } from "electron";
import { VueBus } from "@/renderer/bus";

declare module "vue/types/vue" {
  interface Vue {
    readonly $bus: typeof VueBus;
  }
}
