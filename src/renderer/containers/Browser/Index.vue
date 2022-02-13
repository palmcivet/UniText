<template>
  <transition name="fade" mode="out-in" appear>
    <keep-alive>
      <component :is="browserType" />
    </keep-alive>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";

import useBrowser from "@/renderer/stores/browser";
import BrowserBookmark from "./BrowserBookmark.vue";
import BrowserSearch from "./BrowserSearch.vue";
import BrowserFile from "./BrowserFile.vue";
import BrowserTag from "./BrowserTag.vue";

export default defineComponent({
  name: "Browser",

  components: {
    BrowserBookmark,
    BrowserSearch,
    BrowserFile,
    BrowserTag,
  },

  setup() {
    const { browserType } = storeToRefs(useBrowser());

    return {
      browserType,
    };
  },
});
</script>

<style lang="less" scoped></style>
