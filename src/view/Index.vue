<template>
  <div>
    <!-- 顶栏 -->
    <header class="layout-header">
      <span>UniText</span>
    </header>

    <main class="layout-main">
      <!-- 左侧栏 -->
      <aside class="left-side-bar">
        <side-bar
          :isShowSide="isShowSide"
          :sideWidth="finalLeftWidth"
          @toggleSide="handleToggle()"
        />
        <span v-show="isShowSide" ref="leftResize" />
      </aside>

      <!-- 编辑区 -->
      <section
        class="center-container"
        :style="{
          width: isShowSide
            ? `calc(100vw - 45px - ${finalLeftWidth}px - ${finalRightWidth}px`
            : `calc(100vw - 45px - ${finalRightWidth}px`,
        }"
      >
        <work-bench />
      </section>

      <!-- 右侧栏 -->
      <aside class="right-side-bar" :style="{ width: `${finalRightWidth}px` }">
        <span v-show="isShowPannel" ref="rightResize" />
        <pannel />
      </aside>
    </main>

    <!-- 底栏 -->
    <footer class="layout-footer" />
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, shell } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { State, Action } from "vuex-class";

import SideBar from "@/view/SideBar/Index.vue";
import WorkBench from "@/view/WorkBench/Index.vue";
import Pannel from "@/view/Panel/Index.vue";
import { checkUpdate } from "@/common/main/utils";

@Component({
  name: "App",
  components: {
    SideBar,
    WorkBench,
    Pannel,
  },
})
export default class App extends Vue {
  // TODO 以下收入 preference

  isShowSide = true;

  isShowPannel = true;

  leftViewWidth = 200;

  rightViewWidth = 180;

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

  handleToggle() {
    this.isShowSide = !this.isShowSide;
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
        // DEV @layout-leftSide-right-column;
        if (leftSideBarWidth >= 150 && leftSideBarWidth <= 250) {
          this.leftViewWidth = leftSideBarWidth;
        }
      };

      const mouseUpHandlerR = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandlerR, false);
        document.removeEventListener("mouseup", mouseUpHandlerR, false);
        // DEV @layout-rightSide-bar;
        if (rightSideBarWidth >= 150 && rightSideBarWidth <= 250) {
          this.rightViewWidth = rightSideBarWidth;
        }
      };

      const mouseDownHandlerL = (e: MouseEvent) => {
        startX = e.clientX;
        startWidth = +this.leftViewWidth;
        document.addEventListener("mousemove", mouseMoveHandlerL, false);
        document.addEventListener("mouseup", mouseUpHandlerL, false);
      };

      const mouseDownHandlerR = (e: MouseEvent) => {
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

  mounted() {
    // const newVersion = checkUpdate();
    // if (newVersion !== "") {
    // }
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

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
  left: 0;
  width: auto;
  display: flex;
}

.right-side-bar {
  position: absolute;
  right: 0;
  display: flex;
}

/* 以下为 resize */

.layout-main {
  span {
    width: 1.5px;
    height: 100%;
    cursor: col-resize;
  }

  .left-side-bar span:hover {
    border-right: @resize-bar;
  }

  .right-side-bar span:hover {
    border-left: @resize-bar;
  }
}
</style>
