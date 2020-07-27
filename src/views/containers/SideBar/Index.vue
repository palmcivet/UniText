<template>
  <div>
    <a-menu class="left-column" mode="vertical" :defaultSelectedKeys="['/files']">
      <a-menu-item
        v-for="menu in sideMenus"
        :key="menu.router"
        :title="menu.text"
        @click="clickMenu($event)"
      >
        <div>
          <i
            class="ri-xl"
            :class="menu.icon"
            :style="{
              color: currentRouter === menu.router ? '#f9d757' : 'inherit',
            }"
          ></i>
        </div>
      </a-menu-item>
    </a-menu>

    <section class="right-column" v-show="isShowSide" :style="{ width: `${width}px` }">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "SideBar" })
export default class SideBar extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  })
  isShowSide!: Boolean;

  @Prop({
    type: Number,
    required: true,
  })
  width!: number;

  get currentRouter() {
    return this.$route.path;
  }

  get sideMenus() {
    return [
      {
        icon: "ri-folders-line",
        text: this.$t("files"),
        router: "/files",
      },
      {
        icon: "ri-search-line",
        text: this.$t("search"),
        router: "/search",
      },
      {
        icon: "ri-bookmark-3-line",
        text: this.$t("bookmarks"),
        router: "/bookmarks",
      },
      {
        icon: "ri-price-tag-3-line",
        text: this.$t("tags"),
        router: "/tags",
      },
      // TODO 将设置的路径改为点击前，而非强制 /files
      {
        icon: "ri-settings-line",
        text: this.$t("settings"),
        router: "/",
      },
    ];
  }

  clickMenu(e: { key: string }) {
    if (this.currentRouter === e.key) {
      this.isShowSide = !this.isShowSide;
    } else {
      this.$router.push(e.key);
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/var.less";

div {
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
