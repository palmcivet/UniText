import Theme from "@/renderer/services/Theme";
import Snippet from "@/renderer/services/Snippet";
import Markdown from "@/renderer/services/Markdown";
import Preference from "@/renderer/services/PreferenceService";
import { IVueBus } from "@/renderer/plugins/VueBus";
import { IVueLayout } from "@/renderer/plugins/VueLayout";
import { I18n } from "vue-i18n";

declare module "vue/types/vue" {
  interface Vue extends IVueBus, IVueLayout {
    $theme: Theme;
    $snippet: Snippet;
    $markdown: Markdown;
    $preference: Preference;
  }
}
