<template>
  <aside>
    <check-list
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

import Tags from "@/view/SideBar/Tags/Index.vue";
import Files from "@/view/SideBar/Files/Index.vue";
import Marks from "@/view/SideBar/Marks/Index.vue";
import Search from "@/view/SideBar/Search/Index.vue";
import Setting from "@/view/SideBar/Setting/Index.vue";
import CheckList from "@/widget/CheckList/Index.vue";
import { IGeneralState } from "@/interface/vuex/modules/general";

const general = namespace("general");

@Component({
  name: "SideBar",
  components: {
    Tags,
    Files,
    Marks,
    Search,
    Setting,
    CheckList,
  },
})
export default class SideBar extends Vue {
  @Prop({
    type: Number,
    required: true,
  })
  sideWidth!: number;

  @general.State((state: IGeneralState) => state.appearance.showSideBar)
  isShowSide!: boolean;

  @general.Mutation("TOGGLE_SIDE_BAR")
  TOGGLE_SIDE_BAR!: () => void;

  activeItem = "Files";

  get menuList() {
    return {
      Files: {
        icon: "ri-xl ri-folders-line",
        text: this.$t("files"),
      },
      Search: {
        icon: "ri-xl ri-search-line",
        text: this.$t("search"),
      },
      Marks: {
        icon: "ri-xl ri-bookmark-3-line",
        text: this.$t("bookmarks"),
      },
      Tags: {
        icon: "ri-xl ri-price-tag-3-line",
        text: this.$t("tags"),
      },
      Setting: {
        icon: "ri-xl ri-settings-line",
        text: this.$t("setting"),
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
@import "~@/asset/styles/var.less";

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
        bottom: 10px;
      }
    }
  }

  .right-column {
    background: @primary-bg;
  }
}
</style>
