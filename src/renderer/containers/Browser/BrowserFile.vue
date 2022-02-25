<template>
  <div class="browser-container">
    <template v-if="false">
      <div class="browser-title">
        <div class="title-label">
          <span>{{ $t("view.browser.file.emptyCabin") }}</span>
        </div>
        <div class="title-actions"></div>
      </div>

      <div class="browser-view file-blank">
        <button class="unitext-button" @click="onOpenProject()">
          {{ $t("view.browser.file.openCabin") }}
        </button>
      </div>
    </template>

    <template v-else>
      <div class="browser-title">
        <div class="title-label">
          <span>{{ $t("view.browser.file.label") }}</span>
        </div>
        <div class="title-actions">
          <i
            class="unitext-icon ri-checkbox-indeterminate-line"
            :title="$t('view.browser.file.toggleFolder')"
            @click="onToggleAll()"
          />
        </div>
      </div>

      <div class="browser-view" ref="treeviewRef" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "File",

  inject: ["$browser"],

  mounted() {
    const root = this.$refs.treeviewRef as HTMLElement;
    this.$browser.invoke(root);
  },

  beforeUnmount() {
    this.$browser.dispose();
  },

  methods: {
    onOpenProject() {
      this.$browser.doOpenProject();
    },

    onToggleAll() {
      this.$browser.doToggleAll();
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";
@import "./style.less";

.browser-container {
  .file-blank {
    width: 100%;
    position: relative;
    user-select: none;
    display: inline-flex;
    align-items: center;
    color: var(--u-browser-fg);
    background-color: var(--u-browser-bg);
  }

  .unitext-button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 8px;
    width: fit-content;
  }

  ::v-deep(.u-treeview) {
    .u-listview {
      color: var(--u-browser-item-fg);
      background-color: var(--u-browser-item-bg);

      .u-list__item {
        padding: 0 4px;

        &:hover {
          color: var(--u-browser-item-hover-fg);
          background-color: var(--u-browser-item-hover-bg);
        }

        .u-label {
          font-size: @font-size-large;
        }
      }

      &:hover .u-indent div {
        border-color: var(--u-browser-indent-fg);
      }
    }

    &__drag {
      &-src {
        opacity: 0.6;
      }

      &-dst {
        color: var(--u-browser-item-drag-fg);
        background-color: var(--u-browser-item-drag-bg);
      }
    }
  }
}
</style>
