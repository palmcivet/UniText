import { AllElectron } from "electron";
import { VueBus } from "@/renderer/bus";

declare module "vue/types/vue" {
  interface Vue {
    readonly $bus: typeof VueBus;
    readonly $i18n: {
      lang: number;
      add: (msg: object) => void;
      setLang: (msg: number) => void;
    };
    $t: (path: string, ...args: any) => any;
  }
}
