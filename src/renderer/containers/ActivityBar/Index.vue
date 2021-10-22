<template>
  <div class="activity-bar">
    <ul class="browser-list">
      <li
        v-for="(item, index) of browserList"
        :key="index"
        :class="{ active: browserType === item.type }"
        @click="onClickBrowser(item.type)"
      >
        <i :class="['ri-lg', item.icon]" />
        <span>{{ item.title }}</span>
      </li>
    </ul>
    <div class="divider"></div>
    <ul class="workbench-list">
      <router-link
        v-for="(item, index) of workbenchList"
        v-slot="{ navigate }"
        custom
        :key="index"
        :to="`/${item.type}`"
        @click="workbench.SWITCH_WORKBENCH(item.type)"
      >
        <li @click="navigate" role="link">
          <i :class="['ri-lg', item.icon]" />
          <span>{{ item.title }}</span>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import useBrowser from "@/renderer/store/browser";
import useWorkbench from "@/renderer/store/workbench";
import { EBrowserType } from "@/typings/store/browser";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ActivityBar",

  components: {},

  data() {
    return {
      browserList: [
        {
          icon: "ri-folders-line",
          title: this.$t("sidebar.files"),
          type: EBrowserType.FILE,
        },
        {
          icon: "ri-search-line",
          title: this.$t("sidebar.search"),
          type: EBrowserType.SEARCH,
        },
        {
          icon: "ri-bookmark-3-line",
          title: this.$t("sidebar.marks"),
          type: EBrowserType.BOOKMARK,
        },
        {
          icon: "ri-price-tag-3-line",
          title: this.$t("sidebar.tags"),
          type: EBrowserType.TAG,
        },
      ],

      workbenchList: [
        {
          icon: "ri-calendar-check-line",
          title: "日程",
          type: "setting",
        },
        {
          icon: "ri-dashboard-3-line",
          title: "数据面板",
          type: "setting",
        },
        {
          icon: "ri-pie-chart-line",
          title: "数据面板",
          type: "setting",
        },
        {
          icon: "ri-settings-line",
          title: this.$t("sidebar.settings"),
          type: "setting",
        },
      ],
    };
  },

  setup() {
    const browser = useBrowser();
    const workbench = useWorkbench();
    const browserType = computed(() => browser.browserType);

    const onClickBrowser = (type: EBrowserType) => {
      if (browserType.value === type) {
        browser.TOGGLE_BROWSER();
        // TODO
        // useRouter().push("/document");
      } else {
        browser.SWITCH_BROWSER(type);
        browser.isShowBrowser && browser.TOGGLE_BROWSER();
      }
    };

    return {
      browser,
      workbench,
      browserType,
      onClickBrowser,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.activity-bar {
  height: 100%;
  width: @layout-leftside-left-width;
  background: var(--activityBar-Bg);
  display: flex;
  flex-direction: column;

  @padding-width: 0px;
  @radius-value: 0px;
  padding: 0 @padding-width;

  li {
    width: 100%;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
    color: var(--activityBar-inactiveFg);
    padding: 6px 10px + @padding-width;
    margin: calc(@padding-width / 2) 0;
    border-radius: @radius-value;

    span {
      margin-left: 8px;
      user-select: none;
    }
  }

  .divider {
    margin: 5px 10px;
    border-top: 1px solid #d7dae033;
  }

  .browser-list {
    li {
      &:hover {
        color: var(--activityBar-activeFg);
        background-color: rgb(92, 92, 92);
      }

      &.active {
        color: var(--activityBar-activeFg);
        background-color: rgb(73, 73, 73);
      }
    }
  }

  .workbench-list {
    li {
      &:hover {
        color: var(--activityBar-activeFg);
      }
    }
  }
}
</style>
