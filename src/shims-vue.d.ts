import Theme from "@/common/userData/Theme";
import Snippet from "@/common/userData/Snippet";
import Markdown from "@/common/userData/Markdown";
import Preference from "@/common/userData/Preference";
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
