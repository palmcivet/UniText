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
@import "./style.less";

.browser-container {
  .file-blank {
    width: 100%;
    position: relative;
    user-select: none;
    display: inline-flex;
    align-items: center;
    color: var(--primary-fg); // DEV
    background-color: var(--hover-bg); // DEV
  }

  .unitext-button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 0.4rem;
    width: fit-content;
  }

  ::v-deep(.u-treeview) {
    .u-listview {
      .u-list__item {
        padding: 0 4px;
        color: var(--tertiary-fg);

        &:hover {
          color: var(--primary-fg);
          background-color: var(--primary-bg);
        }

        .u-label {
          font-size: 15px;
        }
      }

      &:hover .u-indent div {
        border-color: #868e977a; // DEV
      }
    }

    &__drag {
      &-src {
        opacity: 0.6;
      }

      &-dst {
        background-color: #465a6a;
      }
    }
  }
}
</style>
