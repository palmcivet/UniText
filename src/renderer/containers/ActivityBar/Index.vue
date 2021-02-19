<template>
  <CheckList
    class="activity-bar"
    :listGroup="menuList"
    :condition="activity"
    :activeStyle="{ color: this.isShowSide ? 'var(--activityBar-activeFg)' : '' }"
    @click="handleClick($event)"
  />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import CheckList from "@/renderer/components/CheckList.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { EActivityType, ISideBarState } from "@/typings/vuex/sideBar";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "ActivityBar",
  components: {
    CheckList,
  },
})
export default class ActivityBar extends Vue {
  @general.State((state: IGeneralState) => state.interface.showSideBar)
  isShowSide!: boolean;

  @general.Mutation("TOGGLE_SIDE_BAR")
  TOGGLE_SIDE_BAR!: () => void;

  @sideBar.State((state: ISideBarState) => state.activity)
  activity!: EActivityType;

  @sideBar.Mutation("CHOOSE_ACTIVITY")
  CHOOSE_ACTIVITY!: (type: EActivityType) => void;

  get menuList() {
    return {
      Files: {
        icon: "ri-xl ri-folders-line",
        title: this.$t("sidebar.files"),
      },
      Search: {
        icon: "ri-xl ri-search-line",
        title: this.$t("sidebar.search"),
      },
      Bookmarks: {
        icon: "ri-xl ri-bookmark-3-line",
        title: this.$t("sidebar.bookmarks"),
      },
      Tags: {
        icon: "ri-xl ri-price-tag-3-line",
        title: this.$t("sidebar.tags"),
      },
      Settings: {
        icon: "ri-xl ri-settings-line",
        title: this.$t("sidebar.settings"),
      },
    };
  }

  handleClick(e: EActivityType) {
    if (!this.isShowSide) {
      this.TOGGLE_SIDE_BAR();
      this.CHOOSE_ACTIVITY(e);
      return;
    }

    if (this.activity === e) {
      this.TOGGLE_SIDE_BAR();
    } else {
      this.CHOOSE_ACTIVITY(e);
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.activity-bar {
  position: relative;
  width: @layout-leftSide-left-width;
  background: var(--activityBar-Bg);

  /deep/ li {
    padding: 11.5px;
    margin-top: 8px;
    cursor: pointer;
    color: var(--activityBar-inactiveFg);

    &:last-child {
      position: absolute;
      bottom: 0px;
    }
  }
}
</style>
