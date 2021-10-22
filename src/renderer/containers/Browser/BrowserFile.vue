<template>
  <div class="browser-files">
    <template v-if="true">
      <div class="title-blank">
        <span>{{ $t("sidebar.files_empty") }}</span>
      </div>

      <div class="container-blank">
        <button class="unitext-button" @click="OPEN_PROJECT()">
          {{ $t("sidebar.files_button") }}
        </button>
      </div>
    </template>

    <template v-else>
      <div class="title-opened">
        <span>{{ $t("sidebar.files_title") }}</span>
        <i
          class="ri-checkbox-indeterminate-line"
          :title="$t('sidebar.files_toggle')"
          @click="handleToggleAll()"
        />
      </div>

      <div class="container-opened" ref="treeview" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useBrowser from "@/renderer/store/browser";

export default defineComponent({
  name: "Files",

  components: {},

  setup() {
    const handleToggleAll = () => {};

    const browser = useBrowser();

    return {
      handleToggleAll,
      OPEN_PROJECT: browser.OPEN_PROJECT,
    };
  },
});
</script>

<style lang="less" scoped>
.browser-files {
  height: 100%;
  display: flex;
  flex-direction: column;

  .container-blank {
    position: relative;
    height: 100%;
  }

  button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 0.5em;
  }
}
</style>
