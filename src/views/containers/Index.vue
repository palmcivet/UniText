<template>
  <div>
    <!-- 顶栏 -->
    <header class="layout-header">
      <span>UniText</span>
    </header>

    <main class="layout-main">
      <!-- 左侧栏 -->
      <aside class="left-side-bar">
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

        <section
          class="right-column"
          v-show="isShowSide"
          :style="{ width: `${finalLeftWidth}px` }"
        >
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </section>

        <span ref="leftResize" v-show="isShowSide" id="left"></span>
      </aside>

      <!-- 编辑区 -->
      <section
        class="center-container"
        :style="{
          width: `calc(100vw - 45px - ${finalLeftWidth}px - ${finalRightWidth}px`,
        }"
      >
        <work-bench></work-bench>
      </section>

      <!-- 右侧栏 -->
      <aside class="right-side-bar" :style="{ width: `${finalRightWidth}px` }">
        <span ref="rightResize"></span>
      </aside>

      <a-modal
        title="🔥 New Version"
        :visible="updateModalVisible"
        :footer="null"
        @cancel="updateModalVisible = false"
        :maskClosable="false"
      >
        <div class="download-container">
          👉
          <a href="https://gridea.dev">Gridea Homepage</a>
          |
          <a href="https://github.com/getgridea/gridea/releases">Github Releases</a>
          👈
        </div>
        <div class="version-info" v-html="updateContent"></div>
      </a-modal>
    </main>

    <!-- 底栏 -->
    <footer class="layout-footer"></footer>
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, shell } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import axios from "axios";
import WorkBench from "@/views/containers/WorkBench/Index.vue";
import markdown from "@/helpers/markdown";
import * as pkg from "@/../package.json";

@Component({
  components: {
    WorkBench,
  },
})
export default class App extends Vue {
  // @State("site") site!: Site;

  // @Action("site/updateSite") updateSite!: (siteData: Site) => void;

  version = (pkg as any).version;

  hasUpdate = false;

  newVersion = "";

  updateModalVisible = false;

  updateContent = "";

  // 以下为修改后
  // TODO 以下收入 preference
  isShowSide = true;

  leftViewWidth = 200;

  rightViewWidth = 180;

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

  get finalLeftWidth() {
    return this.leftViewWidth;
  }

  set finalLeftWidth(value: number) {
    this.leftViewWidth = value;
  }

  get finalRightWidth() {
    return this.rightViewWidth;
  }

  set finalRightWidth(value: number) {
    this.rightViewWidth = value;
  }

  clickMenu(e: { key: string }) {
    if (this.currentRouter === e.key) {
      this.isShowSide = !this.isShowSide;
    } else {
      this.$router.push(e.key);
    }
  }

  created() {
    this.$nextTick(() => {
      const { leftResize, rightResize } = this.$refs;

      let leftSideBarWidth = +this.leftViewWidth;
      let rightSideBarWidth = +this.rightViewWidth;

      this.leftViewWidth = leftSideBarWidth;
      this.rightViewWidth = rightSideBarWidth;

      let startX = 0;
      let startWidth = leftSideBarWidth;

      const mouseMoveHandlerL = (e: MouseEvent) => {
        const offset = e.clientX - startX;
        const flag = (e.target as HTMLElement).id;
        leftSideBarWidth = startWidth + offset;
        if (leftSideBarWidth < 150) {
          this.leftViewWidth = 150;
        } else if (leftSideBarWidth > 250) {
          this.leftViewWidth = 250;
        } else {
          this.leftViewWidth = leftSideBarWidth;
        }
      };

      const mouseMoveHandlerR = (e: MouseEvent) => {
        const offset = e.clientX - startX;
        const flag = (e.target as HTMLElement).id;
        rightSideBarWidth = startWidth - offset;
        if (rightSideBarWidth < 150) {
          this.rightViewWidth = 150;
        } else if (rightSideBarWidth > 250) {
          this.rightViewWidth = 250;
        } else {
          this.rightViewWidth = rightSideBarWidth;
        }
      };

      const mouseUpHandlerL = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandlerL, false);
        document.removeEventListener("mouseup", mouseUpHandlerL, false);
        const flag = (e.target as HTMLElement).id;
        // DEV @layout-leftSide-right-column;
        if (leftSideBarWidth >= 150 && leftSideBarWidth <= 250) {
          this.leftViewWidth = leftSideBarWidth;
        }
      };

      const mouseUpHandlerR = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandlerR, false);
        document.removeEventListener("mouseup", mouseUpHandlerR, false);
        const flag = (e.target as HTMLElement).id;
        // DEV @layout-rightSide-bar;
        if (rightSideBarWidth >= 150 && rightSideBarWidth <= 250) {
          this.rightViewWidth = rightSideBarWidth;
        }
      };

      const mouseDownHandlerL = (e: MouseEvent) => {
        const flag = (e.target as HTMLElement).id;
        startX = e.clientX;
        startWidth = +this.leftViewWidth;
        document.addEventListener("mousemove", mouseMoveHandlerL, false);
        document.addEventListener("mouseup", mouseUpHandlerL, false);
      };

      const mouseDownHandlerR = (e: MouseEvent) => {
        const flag = (e.target as HTMLElement).id;
        startX = e.clientX;
        startWidth = +this.rightViewWidth;
        document.addEventListener("mousemove", mouseMoveHandlerR, false);
        document.addEventListener("mouseup", mouseUpHandlerR, false);
      };

      (leftResize as HTMLElement).addEventListener("mousedown", mouseDownHandlerL, false);
      (rightResize as HTMLElement).addEventListener(
        "mousedown",
        mouseDownHandlerR,
        false
      );
    });
  }

  public async checkUpdate() {
    const res = await axios.get(
      "https://api.github.com/repos/getgridea/gridea/releases/latest"
    );
    if (res.status === 200) {
      this.newVersion = res.data.name;
      const latestVersion = res.data.name
        .substring(1)
        .split(".")
        .map((item: string) => parseInt(item, 10));
      const currentVersion = this.version
        .split(".")
        .map((item: string) => parseInt(item, 10));
      this.updateContent = markdown.render(res.data.body);

      for (let i = 0; i < currentVersion.length; i += 1) {
        if (currentVersion[i] > latestVersion[i]) {
          this.hasUpdate = false;
          break;
        }
        if (currentVersion[i] < latestVersion[i]) {
          this.hasUpdate = true;
          break;
        }
      }

      if (this.hasUpdate) {
        this.$message.success(`🔥  ${this.$t("newVersionTips")}`, 8);
        this.updateModalVisible = true;
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/var.less";

/* 以下为布局 */

.layout-header,
.layout-main,
.layout-footer {
  background: #efefef;
  width: 100vw;
}

.layout-header {
  height: @layout-top-bar;
  -webkit-user-select: none;
  -webkit-app-region: drag;

  span {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    font-size: 13px;
  }
}

.layout-main {
  height: calc(100vh - @layout-top-bar - @layout-bottom-bar);
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
}

.layout-footer {
  height: @layout-bottom-bar;
}

/* 以下为分区 */

.left-side-bar,
.center-container,
.right-side-bar {
  height: calc(100vh - @layout-top-bar - @layout-bottom-bar);
}

.left-side-bar {
  background: @primary-bg;
  left: 0;
  width: auto;
  display: flex;

  .left-column {
    width: @layout-leftSide-left-column;
    height: 100%;

    /deep/ &.ant-menu {
      background: @primary-bg;
      position: relative;
    }

    /deep/ .ant-menu-item {
      padding: 11.5px;
    }

    /deep/ &.ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
      background-color: @primary-bg;
    }

    /deep/ .ant-menu-item:last-child {
      position: absolute;
      bottom: 10px;
    }
  }
}

.right-side-bar {
  position: absolute;
  right: 0;
  display: flex;
  background-color: #f0f8ff// DEV;
}

/* 以下为 resize */

.layout-main span {
  width: 1px;
  height: 100%;
  cursor: col-resize;

  &:hover {
    border-right: 1px solid rgba(216, 216, 216, 0.4); // DEV
  }
}
</style>
