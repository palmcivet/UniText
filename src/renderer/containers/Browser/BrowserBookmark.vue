<template>
  <div class="browser-container">
    <template v-if="false"></template>

    <template v-else>
      <div class="browser-title">
        <div class="title-label">
          <span>{{ $t("view.browser.bookmark.label") }}</span>
        </div>
        <div class="title-actions"></div>
      </div>

      <div class="browser-view" ref="listview" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BrowserBookmark",

  components: {},

  setup() {},
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
