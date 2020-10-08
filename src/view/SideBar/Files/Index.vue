<template>
  <section>
    <header>
      <!-- 工具栏 -->
      <div v-if="isEmptyFolder">无打开的文件/文件夹</div>
      <div v-else>
        <span>文件管理</span>
        <i class="ri-checkbox-indeterminate-line" @click="toggleAll()" title="收起" />
      </div>
    </header>

    <div v-if="isEmptyFolder" class="blank">
      <button @click="OPEN_FOLDER()">打开文件夹</button>
    </div>

    <div
      v-else
      class="wrapper"
      ref="scrollList"
      @mousewheel="handleScroll($event)"
      @mouseenter="handleMouseEnter()"
      @mouseleave="handleMouseLeave()"
    >
      <ul class="list-container" :style="{ transform: `translateY(${reviseOffset}px` }">
        <tree-item
          v-for="(item, idx) in visibleList"
          :key="idx"
          :index="idx"
          :payload="item"
          :isIndent="isIndent"
        />
      </ul>
      <div v-show="isOverLength" class="scroll-track">
        <div
          class="scroll-thumb"
          :style="{
            marginTop: `${scrollBarTop}px`,
            height: `${thumbHeight}px`,
          }"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import draggable from "vuedraggable";

import TreeItem from "./TreeItem.vue";
import { ICacheTree, ILogicTree, ISideBarState } from "@/interface/vuex/modules/sideBar";
import { BUS_FILE, BUS_UI } from "@/common/bus-channel";
import { notEmpty } from "@/common/utils";
import { joinPath } from "@/common/files/files";

const workBench = namespace("workBench");
const sideBar = namespace("sideBar");

const LINE_HEIGHT = 20.8;

@Component({
  name: "File",
  components: {
    draggable,
    TreeItem,
  },
})
export default class Files extends Vue {
  @workBench.Action("OPEN_FILE")
  OPEN_FILE!: (path: string) => void;

  @sideBar.State((state: ISideBarState) => state.files.folderDir)
  folderDir!: string;

  @sideBar.State((state: ISideBarState) => state.files.showIndent)
  showIndent!: boolean;

  @sideBar.Getter("logicTree")
  fileList!: ILogicTree;

  @sideBar.Mutation("CHOOSE_ITEM")
  CHOOSE_ITEM!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_ALL")
  TOGGLE_ALL!: (isOnce: boolean) => void;

  @sideBar.Action("OPEN_FOLDER")
  OPEN_FOLDER!: () => void;

  /**
   * @member 可见区域的长度，需挂载后根据父容器确定
   */
  visibleHeight = 0;

  /**
   * @member 已滚动的高度
   */
  invisibleHeight = 0;

  /**
   * @member 文件列表逻辑上的长度
   */
  get logicalHeight() {
    return this.fileList.length * LINE_HEIGHT;
  }

  /**
   * @member 滚动条已滚动的高度，该命名区别于 `scrollTop`
   */
  get scrollBarTop() {
    return (this.invisibleHeight * this.visibleHeight) / this.logicalHeight;
  }

  /**
   * @member 可见区域能展示的数量
   */
  get visibleCount() {
    return Math.ceil(this.visibleHeight / LINE_HEIGHT);
  }

  /**
   * @member 实际渲染的文件列表
   */
  get visibleList() {
    return this.fileList.slice(
      this.visibleListStart,
      Math.min(this.visibleListEnd, this.fileList.length)
    );
  }

  /**
   * @member 滚动条的长度。thumb / track = track / height
   */
  get thumbHeight() {
    return (this.visibleHeight * this.visibleHeight) / this.logicalHeight;
  }

  /**
   * @member 判断是否打开文件夹
   */
  get isEmptyFolder() {
    return !notEmpty(this.fileList);
  }

  /**
   * @member 判断是否需要显示滚动条
   */
  get isOverLength() {
    return this.logicalHeight > this.visibleHeight;
  }

  isIndent = false;

  isOnce = true;

  /**
   * @member 滚动交界处修正的偏移
   */
  reviseOffset = 0;

  visibleListStart = 0;

  visibleListEnd = 0;

  toggleAll() {
    this.TOGGLE_ALL(this.isOnce);
    this.isOnce = !this.isOnce;
  }

  handleMouseEnter() {
    this.showIndent && (this.isIndent = true);
  }

  handleMouseLeave() {
    this.showIndent && (this.isIndent = false);
  }

  handleScroll(value: MouseWheelEvent) {
    if (!this.isOverLength) {
      return;
    }

    if (this.invisibleHeight + value.deltaY < 0) {
      this.invisibleHeight = 0;
      this.reviseOffset = 0;
      this.visibleListStart = 0;
      this.visibleListEnd = this.visibleCount;
    } else if (
      this.invisibleHeight + value.deltaY >
      this.logicalHeight - this.visibleHeight
    ) {
      this.invisibleHeight = this.logicalHeight - this.visibleHeight;
      this.visibleListEnd = this.fileList.length;
      this.visibleListStart = this.visibleListEnd - this.visibleCount;
      this.reviseOffset = 0;
    } else {
      this.invisibleHeight += value.deltaY;
      this.visibleListStart = Math.floor(this.invisibleHeight / LINE_HEIGHT);
      this.visibleListEnd = this.visibleListStart + this.visibleCount;
      this.reviseOffset = LINE_HEIGHT - (this.invisibleHeight % LINE_HEIGHT);
    }
  }

  mounted() {
    this.$bus.$on(BUS_FILE.OPEN_FILE, (value: string) => {
      this.OPEN_FILE(joinPath(this.folderDir, value));
      this.CHOOSE_ITEM(value);
    });

    /* 监听窗口缩放事件 */
    this.$bus.$on(BUS_UI.SYNC_RESIZE, () => {
      this.visibleHeight = (this.$refs.scrollList as Element).clientHeight;
    });

    setTimeout(() => {
      this.visibleHeight = (this.$refs.scrollList as Element).clientHeight;
      this.visibleListEnd = this.visibleListStart + this.visibleCount;
    }, 400);
  }

  beforeDestroy() {
    this.$bus.$off(BUS_FILE.OPEN_FILE);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/widget.less";

section {
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    color: #252525;
    background-color: rgb(235, 238, 225);
    box-shadow: 0px 1px 5px rgba(222, 241, 185, 0.6);

    > div {
      display: flex;

      > span,
      > i {
        line-height: 20px;
        margin-left: 3px;
      }

      > i {
        cursor: pointer;
      }
    }

    * {
      -webkit-user-select: none;
    }
  }

  > div {
    height: calc(100% - 20px);
    position: relative;
    display: flex;

    &.blank {
      button {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 0.5em;
        transform: translate(-50%, 50%);
        color: whitesmoke;
        background-color: #55aaf3;
        box-shadow: 3px 3px 6px rgba(123, 194, 245, 0.6);
        border-radius: 2px;
        outline-style: none;
        -webkit-user-select: none;
      }
    }

    &.wrapper {
      .list-container {
        width: 100%;
        overflow: hidden;
      }

      .scroll-track {
        height: 100%;
        position: absolute;
        right: 0;
        z-index: 2;
        background-color: rgba(228, 228, 228, 0.5);

        .scroll-thumb {
          width: 6px;
          border-radius: 2px;
          background-color: rgba(225, 235, 197, 0.7);
          display: block;

          &:hover {
            background-color: #d3e79c;
          }
        }
      }
    }
  }
}
</style>
