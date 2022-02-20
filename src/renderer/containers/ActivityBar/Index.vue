<template>
  <div class="activity-bar">
    <ul class="browser-list">
      <li
        v-for="(item, index) of browserList"
        :key="index"
        :class="['browser-list__item', { active: browserType === item.type }]"
        @click="onSwitchBrowser(item.type)"
      >
        <i :class="['item-icon', 'ri-lg', item.icon]" />
        <span class="item-label">{{ item.title }}</span>
      </li>
    </ul>

    <div class="activity-divider"></div>

    <ul class="workbench-list">
      <li
        v-for="(item, index) of workbenchList"
        :key="index"
        class="workbench-list__item"
        @click="onSwitchWorkbench(item.type)"
      >
        <i :class="['item-icon', 'ri-lg', item.icon]" />
        <span class="item-label">{{ item.title }}</span>
      </li>
    </ul>

    <div v-if="false" class="activity-divider"></div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import useBrowser from "@/renderer/stores/browser";
import { EBrowserType, EWorkbenchType } from "@/shared/typings/store";

export default defineComponent({
  name: "ActivityBar",

  components: {},

  inject: ["$workbench"],

  computed: {
    browserList() {
      return [
        {
          icon: "ri-folders-line",
          title: this.$t("view.browser.file.label"),
          type: EBrowserType.FILE,
        },
        {
          icon: "ri-search-line",
          title: this.$t("view.browser.search.label"),
          type: EBrowserType.SEARCH,
        },
        {
          icon: "ri-bookmark-3-line",
          title: this.$t("view.browser.bookmark.label"),
          type: EBrowserType.BOOKMARK,
        },
        {
          icon: "ri-price-tag-3-line",
          title: this.$t("view.browser.tag.label"),
          type: EBrowserType.TAG,
        },
      ];
    },

    workbenchList() {
      return [
        {
          icon: "ri-dashboard-3-line",
          title: this.$t("view.workbench.dashboard"),
          type: EWorkbenchType.DASHBOARD,
        },
        {
          icon: "ri-mind-map",
          title: this.$t("view.workbench.graphview"),
          type: EWorkbenchType.GRAPHVIEW,
        },
        {
          icon: "ri-calendar-check-line",
          title: this.$t("view.workbench.schedule"),
          type: EWorkbenchType.SCHEDULE,
        },
        {
          icon: "ri-settings-line",
          title: this.$t("view.workbench.setting"),
          type: EWorkbenchType.SETTING,
        },
      ];
    },
  },

  setup() {
    const browser = useBrowser();
    const browserType = computed(() => browser.browserType);

    const onSwitchBrowser = (type: EBrowserType) => {
      if (browserType.value === type) {
        browser.TOGGLE_BROWSER();
      } else {
        if (!browser.isShowBrowser) {
          browser.TOGGLE_BROWSER();
        }
        browser.SWITCH_BROWSER(type);
      }
    };

    return {
      browserType,
      onSwitchBrowser,
    };
  },

  methods: {
    onSwitchWorkbench(type: EWorkbenchType) {
      this.$workbench.doOpenWorkbench(type);
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";

.activity-bar {
  display: flex;
  flex-direction: column;
  padding: 0 var(--u-border-radius);
  color: var(--u-activityBar-fg);
  background-color: var(--u-activityBar-bg);
  padding-top: 4px;

  .activity-divider {
    margin: 4px 20px;
    border-top: 1px solid var(--u-activityBar-divider-fg);
  }

  .workbench-list,
  .browser-list {
    &__item {
      width: 100%;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      margin: calc(var(--u-border-radius) / 2) 0;
      border-radius: var(--u-border-radius);

      .item-icon {
        font-size: @icon-font-size-normal;
        line-height: @line-height-normal;
      }

      .item-label {
        margin-left: 8px;
        user-select: none;
        font-size: @font-size-normal;
        line-height: @line-height-normal;
        opacity: 0.8;
      }

      &:hover {
        color: var(--u-activityBar-hover-fg);
      }

      &.active {
        color: var(--u-activityBar-active-fg);
        background-color: var(--u-activityBar-active-bg);
      }
    }
  }

  .browser-list__item:hover {
    background-color: var(--u-activityBar-hover-bg);
  }
}
</style>
