<template>
  <div class="browser-tag">
    <template v-if="true">
      <div class="toolbar-blank">标签</div>
      <div class="container-blank"></div>
    </template>

    <template v-else>
      <div class="toolbar-opened">
        <span>{{ $t("sidebar.files_title") }}</span>
      </div>

      <div class="container-opened" ref="listview" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BrowserTag",

  components: {},

  setup() {},
});
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
