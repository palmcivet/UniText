<template>
  <article>
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

    <div v-show="isShowSide" class="right-column" :style="{ width: `${sideWidth}px` }">
      <keep-alive>
        <component :is="activeItem" />
      </keep-alive>
    </div>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Tags from "@/view/SideBar/Tags/Index.vue";
import Files from "@/view/SideBar/Files/Index.vue";
import Marks from "@/view/SideBar/Marks/Index.vue";
import Search from "@/view/SideBar/Search/Index.vue";
import Setting from "@/view/SideBar/Setting/Index.vue";

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
    type: Boolean,
    required: true,
  })
  isShowSide!: boolean;

  @Prop({
    type: Number,
    required: true,
  })
  sideWidth!: number;

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
    if (this.activeItem === e.key) {
      this.$emit("toggleSide");
    } else {
      this.activeItem = e.key;
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

article {
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
