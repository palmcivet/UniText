<template>
  <section>
    <header>
      <div v-if="isEmptyFolder">无打开的文件/文件夹</div>
      <div v-else>
        <span>文件管理</span>
        <i class="ri-checkbox-indeterminate-line" @click="toggleAll()" title="收起" />
      </div>
    </header>

    <div v-if="isEmptyFolder" class="blank">
      <button @click="OPEN_PROJECT()">打开文件夹</button>
    </div>

    <div
      v-else
      class="project"
      @mouseenter="handleMouseEnter()"
      @mouseleave="handleMouseLeave()"
    >
      <ul>
        <FileTreeNode
          v-for="(data, name) in fileTree"
          :key="data.order"
          :tier="0"
          :node="data"
          :route="[name]"
          :isIndent="isIndent"
        />
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Draggable from "vuedraggable";

import FileTreeNode from "./FileTreeNode.vue";
import { ISideBarState, ITree } from "@/typings/vuex/sideBar";

const sideBar = namespace("sideBar");

@Component({
  name: "Files",
  components: {
    FileTreeNode,
    Draggable,
  },
})
export default class Files extends Vue {
  @sideBar.State((state: ISideBarState) => state.fileTree)
  fileTree!: ITree;

  @sideBar.State((state: ISideBarState) => state.filesState.showIndent)
  showIndent!: boolean;

  @sideBar.Getter("isEmptyFolder")
  isEmptyFolder!: boolean;

  @sideBar.Mutation("CHOOSE_ITEM")
  CHOOSE_ITEM!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_ALL")
  TOGGLE_ALL!: (isOnce: boolean) => void;

  @sideBar.Action("LOAD_TREE")
  LOAD_TREE!: () => void;

  @sideBar.Action("OPEN_PROJECT")
  OPEN_PROJECT!: () => void;

  isIndent = false;

  isOnce = true;

  toggleAll() {
    this.TOGGLE_ALL(this.isOnce);
    this.CHOOSE_ITEM("");
    this.isOnce = !this.isOnce;
  }

  handleMouseEnter() {
    this.showIndent && (this.isIndent = true);
  }
  handleMouseLeave() {
    this.showIndent && (this.isIndent = false);
  }

  mounted() {
    this.LOAD_TREE();
  }
}
</script>

<style lang="less" scoped>
@header-height: 20px;

section {
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    color: #252525;
    z-index: 999;
    background-color: rgb(235, 238, 225);
    box-shadow: 0px 1px 5px rgba(222, 241, 185, 0.6);

    > div {
      display: flex;

      > span,
      > i {
        line-height: @header-height;
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
    height: calc(100% - @header-height);
    position: relative;

    &.blank {
      button {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 0.5em;
        cursor: pointer;
        transform: translate(-50%, 50%);
        color: whitesmoke;
        background-color: #55aaf3;
        box-shadow: 3px 3px 6px rgba(123, 194, 245, 0.6);
        outline-style: none;
        border-radius: 2px;
        border-color: transparent;
        -webkit-user-select: none;
      }
    }

    &.project {
      ul {
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
