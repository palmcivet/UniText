import Theme from "@/renderer/services/Theme";
import Snippet from "@/renderer/services/Snippet";
import Markdown from "@/renderer/services/Markdown";
import Preference from "@/renderer/services/PreferenceService";
import { IVueBus } from "@/renderer/plugins/VueBus";
import { IVueI18n } from "@/renderer/plugins/VueI18n";
import { IVueLayout } from "@/renderer/plugins/VueLayout";


declare module "vue/types/vue" {
  interface Vue extends IVueI18n, IVueBus, IVueLayout {
    $theme: Theme;
    $snippet: Snippet;
    $markdown: Markdown;
    $preference: Preference;
  }
}
