<template>
  <transition name="fade" mode="out-in" appear>
    <keep-alive>
      <component :is="browserType" />
    </keep-alive>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import useBrowser from "@/renderer/stores/browser";
import BrowserBookmark from "./BrowserBookmark.vue";
import BrowserSearch from "./BrowserSearch.vue";
import BrowserFile from "./BrowserFile.vue";
import BrowserTag from "./BrowserTag.vue";
import { storeToRefs } from "pinia";

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

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.browser-file,
.browser-search,
.browser-bookmark,
.browser-tag {
  background: var(--sideBar-Bg);
  color: var(--sideBar-Fg);
  height: 100%;
  display: flex;
  flex-direction: column;

  .title-blank,
  .title-opened {
    display: flex;
    padding: 0 0.8em;
    justify-content: space-between;
    height: @sideBar-header-height;
    line-height: @sideBar-header-height;
    color: var(--sideBarHeader-Fg);
    background: var(--sideBarHeader-Bg);

    i {
      line-height: @sideBar-header-height;
      cursor: pointer;
      padding: 0 2px;
    }

    * {
      user-select: none;
    }
  }

  .container-blank,
  .container-opened {
    height: 100%;
  }
}
</style>
