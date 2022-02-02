<template>
  <div class="browser-files">
    <template v-if="false">
      <div class="toolbar-blank">
        <span>{{ $t("sidebar.files_empty") }}</span>
      </div>

      <div class="container-blank">
        <button class="unitext-button" @click="onOpenProject()">
          {{ $t("sidebar.files_button") }}
        </button>
      </div>
    </template>

    <template v-else>
      <div class="toolbar-opened">
        <span>{{ $t("sidebar.files_title") }}</span>
        <i
          class="ri-checkbox-indeterminate-line"
          :title="$t('sidebar.files_toggle')"
          @click="onToggleAll()"
        />
      </div>

      <div class="container-opened" ref="treeviewRef" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Files",

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
.browser-files {
  height: 100%;
  display: flex;
  flex-direction: column;

  .unitext-button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 0.4rem;
    width: fit-content;
  }

  .toolbar-opened,
  .toolbar-blank {
    width: 100%;
    user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 4px;
    color: var(--primary-fg); // DEV
    background-color: var(--hover-bg); // DEV
  }

  .container-opened,
  .container-blank {
    position: relative;
    height: 100%;
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
