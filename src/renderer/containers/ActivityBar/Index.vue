<template>
  <aside>
    <CheckList
      class="left-column"
      :listGroup="menuList"
      :condition="activeItem"
      :activeStyle="{ color: this.isShowSide ? '#f9d757' : '' }"
      @click="handleClick($event)"
    />

    <keep-alive>
      <component
        class="right-column"
        v-show="isShowSide"
        :style="{ width: `${sideWidth}px` }"
        :is="activeItem"
      />
    </keep-alive>
  </aside>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Tags from "@/renderer/containers/SideBar/Tags.vue";
import Files from "@/renderer/containers/SideBar/Files.vue";
import Search from "@/renderer/containers/SideBar/Search.vue";
import Bookmarks from "@/renderer/containers/SideBar/Bookmarks.vue";
import Settings from "@/renderer/containers/SideBar/Settings.vue";
import CheckList from "@/renderer/components/CheckList.vue";
import { IGeneralState } from "@/typings/vuex/general";

const general = namespace("general");

@Component({
  name: "ActivityBar",
  components: {
    Tags,
    Files,
    Search,
    Settings,
    Bookmarks,
    CheckList,
  },
})
export default class ActivityBar extends Vue {
  @Prop({ type: Number, required: true })
  sideWidth!: number;

  @general.State((state: IGeneralState) => state.appearance.showSideBar)
  isShowSide!: boolean;

  @general.Mutation("TOGGLE_SIDE_BAR")
  TOGGLE_SIDE_BAR!: () => void;

  // TODO
  activeItem = "Settings";

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

  handleClick(e: string) {
    if (!this.isShowSide) {
      this.TOGGLE_SIDE_BAR();
      this.activeItem = e;
      return;
    }

    if (this.activeItem === e) {
      this.TOGGLE_SIDE_BAR();
    } else {
      this.activeItem = e;
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

aside {
  display: flex;

  .left-column {
    position: relative;
    width: @layout-leftSide-left-column;
    height: 100%;

    /deep/ li {
      padding: 11.5px;
      margin: 8px 0;
      cursor: pointer;

      &:last-child {
        position: absolute;
        bottom: 0px;
      }
    }
  }

  .right-column {
    background: @primary-bg;
  }
}
</style>
