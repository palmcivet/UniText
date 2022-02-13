<template>
  <div class="activity-bar">
    <ul class="browser-list">
      <li
        v-for="(item, index) of browserList"
        :key="index"
        :class="['browser-list__item', { active: browserType === item.type }]"
        @click="onSwitchBrowser(item.type)"
      >
        <i :class="['ri-lg', item.icon]" />
        <span>{{ item.title }}</span>
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
        <i :class="['ri-lg', item.icon]" />
        <span>{{ item.title }}</span>
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

  @padding-width: 4px;
  @radius-value: 4px;
  padding: 0 @padding-width;

  .activity-divider {
    margin: calc(5px) 10px;
    border-top: 1px solid var(--activityBar-dividerFg);
  }

  .browser-list__item,
  .workbench-list__item {
    width: 100%;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
    color: var(--activityBar-inactiveFg);
    padding: 4px calc(10px - @padding-width);
    margin: calc(2px + @padding-width / 2) 0;
    border-radius: @radius-value;

    span {
      margin-left: 8px;
      user-select: none;
    }
  }

  .browser-list {
    margin-top: 4px;

    &__item {
      &:hover {
        color: var(--activityBar-hoverFg);
        background-color: var(--activityBar-hoverBg);
      }

      &.active {
        color: var(--activityBar-activeFg);
        background-color: var(--activityBar-activeBg);
      }
    }
  }

  .workbench-list {
    &__item {
      &:hover {
        color: var(--activityBar-activeFg);
      }
    }
  }
}
</style>
