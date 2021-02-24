import { IVueBus } from "@/renderer/plugins/VueBus";
import { IVueI18n } from "@/renderer/plugins/VueI18n";
import { IVueTheme } from "./renderer/plugins/VueTheme";
import { IVueMarkdown } from "@/renderer/plugins/VueMarkdown";

declare module "vue/types/vue" {
  interface Vue extends IVueI18n, IVueBus, IVueTheme, IVueMarkdown {}
}
