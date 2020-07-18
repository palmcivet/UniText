<template>
  <div>
    <!-- 顶栏 -->
    <header class="layout-header">
      <span>
        📝 UniText
      </span>
    </header>

    <main class="layout-main">
      <!-- 左侧栏 -->
      <aside class="container-left">
        <a-menu class="left-bar" mode="vertical" :defaultSelectedKeys="['/files']">
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
      </aside>

      <DynamicBox :minWidth="200" :maxWidth="800" :defaultWidth="300">
        <template #left>
          <section class="left-manager">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </section>
        </template>

        <template #right>
          <!-- 编辑区 -->
          <section class="container-main">
            <Workspace />
          </section>
        </template>
      </DynamicBox>

      <!-- 右侧栏 -->
      <aside class="container-right"></aside>

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
        <h2>{{ newVersion }}</h2>
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
import axios from "axios";
import { State, Action } from "vuex-class";
import Workspace from "@/views/containers/main/Index.vue";
import DynamicBox from "@/components/DynamicBox/Index.vue";
import ISnackbar from "@/interfaces/snackbar";
import markdown from "@/helpers/markdown";
import * as pkg from "@/../package.json";

@Component({
  components: {
    Workspace,
    DynamicBox,
  },
})
export default class App extends Vue {
  // @State("site") site!: Site;

  // @Action("site/updateSite") updateSite!: (siteData: Site) => void;

  ipcRenderer = ipcRenderer;

  version = (pkg as any).version;

  drawer = true;

  hasUpdate = false;

  newVersion = "";

  syncErrorModalVisible = false;

  updateModalVisible = false;

  systemModalVisible = false;

  updateContent = "";

  logModalVisible = false;

  log: any = {};

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
      // TODO: 将设置的路径改为点击前，而非强制 /files
      {
        icon: "ri-settings-line",
        text: this.$t("settings"),
        router: "/",
      },
    ];
  }

  created() {
    this.$bus.$on("site-reload", () => {});

    ipcRenderer.on("log-error", (event: any, result: any) => {
      this.log = result;
      this.logModalVisible = true;
    });
  }

  clickMenu(e: any) {
    this.$router.push(e.key);
  }

  public preview() {
    ipcRenderer.send("html-render");

    ipcRenderer.once("html-rendered", (event: IpcRendererEvent, result: any) => {
      this.$message.success(`🎉  ${this.$t("renderSuccess")}`);
      ipcRenderer.send("app-preview-server-port-get");
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
}

.layout-footer {
  height: @layout-bottom-bar;
}

.container-left,
.container-main,
.container-right {
  display: flex;
  height: calc(100vh - @layout-top-bar - @layout-bottom-bar);
}

.container-left {
  background: @primary-bg;
  left: 0;
  width: auto;
  display: flex;

  &::-webkit-scrollbar {
    width: 0;
  }

  .left-bar {
    width: @layout-left-bar;
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

  .left-manager {
    width: @layout-left-manager;
    height: 100%;
  }
}

.container-main {
  width: calc(100vw - @layout-left-bar - @layout-right-bar);
}

.container-right {
  min-width: @layout-right-bar;
}
</style>
