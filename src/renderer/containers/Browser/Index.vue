<template>
  <transition name="fade" mode="out-in" appear>
    <keep-alive>
      <component :is="browserType" />
    </keep-alive>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import useBrowser from "@/renderer/store/browser";
import BrowserBookmark from "./BrowserBookmark.vue";
// import BrowserSearch from "./BrowserSearch.vue";
import BrowserFile from "./BrowserFile.vue";
import BrowserTag from "./BrowserTag.vue";

export default defineComponent({
  name: "Browser",

  components: {
    BrowserBookmark,
    BrowserFile,
    BrowserTag,
  },

  setup() {
    const browserType = computed(() => useBrowser().browserType);

    return {
      browserType,
    };
  },
});
</script>
