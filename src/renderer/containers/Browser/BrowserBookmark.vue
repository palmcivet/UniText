<template>
  <div class="browser-bookmark">
    <template v-if="true">
      <div class="toolbar-blank">书签</div>
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
  name: "BrowserBookmark",

  components: {},

  setup() {},
});
</script>
