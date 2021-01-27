<template>
  <div>
    <Draggable
      tag="ul"
      ref="tabContainer"
      v-model="openedTabs"
      v-bind="dragOptions"
      :component-data="componentData()"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <li
          v-for="v in openedTabs"
          :key="v.order"
          :class="v.order === currentIndex ? 'current' : ''"
          @click.stop="SELECT_TAB({ cur: v.order })"
          @contextmenu="handleTabContext()"
        >
          <span>{{ v.title }}</span>
          <i class="ri-close-line" @click.stop="CLOSE_FILE(v.order)" />
        </li>
      </transition-group>
    </Draggable>

    <Source class="workbench" />
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";
import Draggable from "vuedraggable";

import Source from "./Source/Index.vue";
import { IPC_MENUMANAGER } from "@/common/channel/ipc";
import { TTab } from "@/typings/vuex/workBench";
import { EMenuContextKey } from "@/typings/bootstrap";

const workBench = namespace("workBench");

@Component({
  name: "TabsWithDoc",
  components: {
    Draggable,
    Source,
  },
})
export default class TabsWithDoc extends Vue {
  @workBench.State("currentIndex")
  currentIndex!: string;

  @workBench.State("currentTabs")
  currentTabs!: Array<TTab>;

  @workBench.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (value: Array<TTab>) => void;

  @workBench.Mutation("SELECT_TAB")
  SELECT_TAB!: (payload: { cur: string; his?: string }) => void;

  @workBench.Action("CLOSE_FILE")
  CLOSE_FILE!: (index: string) => void;

  @workBench.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  drag = false;

  tabRef = this.$el as HTMLElement;

  get openedTabs() {
    return this.currentTabs;
  }

  set openedTabs(value) {
    this.SWITCH_TABS(value);
  }

  get dragOptions() {
    return {
      animation: 150,
      disabled: false,
      ghostClass: "ghost",
    };
  }

  componentData() {
    return {
      on: {
        dblclick: (e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          this.NEW_FILE();
        },
      },
    };
  }

  handleTabScroll(e: WheelEvent) {
    let delta = e.deltaY;
    if (e.deltaX !== 0) {
      delta = e.deltaX;
    }
    const tabs = this.tabRef;
    const newLeft = Math.max(0, Math.min(tabs.scrollLeft + delta, tabs.scrollWidth));
    tabs.scrollLeft = newLeft;
  }

  handleTabContext() {
    ipcRenderer.send(IPC_MENUMANAGER.POPUP_CONTEXT, EMenuContextKey.WORKBENCH_TAB);
  }

  created() {
    this.$nextTick(() => {
      this.tabRef = (this.$refs.tabContainer as Vue).$children[0].$el as HTMLElement;
      this.tabRef.addEventListener("wheel", this.handleTabScroll);
    });
  }

  beforeDestroy() {
    this.tabRef.removeEventListener("wheel", this.handleTabScroll);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

ul {
  cursor: pointer;

  & > span {
    display: flex;
    overflow: auto;
    line-height: @tab-height;

    & > li {
      background-color: rgba(227, 233, 209, 0.5); // DEV
      border-right: 1px solid rgba(200, 200, 200, 0.2); // DEV
      padding: 0 1.5em 0 0.8em;
      position: relative;

      & > span {
        max-width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        -webkit-user-select: none;
      }

      /deep/ i {
        line-height: 12px;
        font-size: 12px;
        border-radius: 50%;
        position: absolute;
        right: 0.5em;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
          background-color: rgba(148, 148, 148, 0.2); // DEV
        }
      }

      &.current {
        background-color: rgba(225, 235, 197, 0.7); // DEV
        border-bottom: 1px solid rgb(4, 174, 38);
      }

      &.ghost {
        opacity: 0.5;
        background: #c8ebfb;
      }
    }
  }
}

div {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.workbench {
  height: calc(100% - 25px);
  width: 100%;
}
</style>
