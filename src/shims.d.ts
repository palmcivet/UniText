import { AllElectron } from "electron";
import { IVueBus } from "@/renderer/plugins/VueBus";
import { IVueI18n } from "@/renderer/plugins/VueI18n";

declare module "vue/types/vue" {
  interface Vue extends IVueI18n, IVueBus {}
}
