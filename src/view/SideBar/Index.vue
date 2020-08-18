<template>
  <aside>
    <a-menu class="left-column" mode="vertical" :defaultSelectedKeys="['/files']">
      <a-menu-item
        v-for="menu in sideMenus"
        :key="menu.item"
        :title="menu.text"
        @click="clickMenu($event)"
      >
        <div>
          <i
            class="ri-xl"
            :class="menu.icon"
            :style="{
              color: activeItem === menu.item ? '#f9d757' : 'inherit',
            }"
          />
        </div>
      </a-menu-item>
    </a-menu>

    <keep-alive>
      <component
        class="right-column"
        v-show="isShowSide"
        :style="{ width: `${sideWidth - 1.3}px` }"
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
import { IGeneralState } from "@/interface/vuex/general";

const general = namespace("general");

@Component({
  name: "SideBar",
  components: {
    Tags,
    Files,
    Marks,
    Search,
    Setting,
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

  get sideMenus() {
    return [
      {
        icon: "ri-folders-line",
        text: this.$t("files"),
        item: "Files",
      },
      {
        icon: "ri-search-line",
        text: this.$t("search"),
        item: "Search",
      },
      {
        icon: "ri-bookmark-3-line",
        text: this.$t("bookmarks"),
        item: "Marks",
      },
      {
        icon: "ri-price-tag-3-line",
        text: this.$t("tags"),
        item: "Tags",
      },
      {
        icon: "ri-settings-line",
        text: this.$t("setting"),
        item: "Setting",
      },
    ];
  }

  activeItem = "Files";

  clickMenu(e: { key: string }) {
    if (!this.isShowSide) {
      this.TOGGLE_SIDE_BAR();
      this.activeItem = e.key;
      return;
    }

    if (this.activeItem === e.key) {
      this.TOGGLE_SIDE_BAR();
    } else {
      this.activeItem = e.key;
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

    /deep/ .ant-menu:not(.ant-menu-horizontal),
    /deep/ .ant-menu-item-selected {
      background-color: unset;
    }

    /deep/ .ant-menu-item {
      padding: 11.5px;
      margin: 8px 0;

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
