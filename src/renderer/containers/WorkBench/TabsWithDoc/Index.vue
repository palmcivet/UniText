<template>
  <div>
    <div class="tabs-with-doc">
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
            :class="v.order === currentIndex ? 'active' : 'inactive'"
            @click.stop="SELECT_TAB({ cur: v.order })"
            @contextmenu="handleTabContext()"
          >
            <span>{{ v.title }}</span>
            <CloseIcon :needSave="v.needSave" @close="CLOSE_FILE(v.order)" />
          </li>
        </transition-group>
      </Draggable>

      <Source />
    </div>
    <span v-sash="'PANEL'"></span>
    <div><SidePanel :fixed="true" /></div>
    <SidePanel :fixed="false" />
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";
import Draggable from "vuedraggable";

import Source from "./Source/Index.vue";
import CloseIcon from "./CloseIcon.vue";
import { IPC_MENUMANAGER } from "@/common/channel/ipc";
import SidePanel from "@/renderer/containers/SidePanel/Index.vue";
import { ITab } from "@/typings/vuex/workBench";
import { EMenuContextKey } from "@/typings/main";

const workBench = namespace("workBench");

@Component({
  name: "TabsWithDoc",
  components: {
    CloseIcon,
    SidePanel,
    Draggable,
    Source,
  },
})
export default class TabsWithDoc extends Vue {
  @workBench.State("currentIndex")
  currentIndex!: string;

  @workBench.State("currentTabs")
  currentTabs!: Array<ITab>;

  @workBench.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (value: Array<ITab>) => void;

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
    ipcRenderer.send(IPC_MENUMANAGER.POPUP_CONTEXT, EMenuContextKey.TAB_BAR);
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

.tabs-with-doc {
  height: 100%;
  display: flex;
  flex-direction: column;

  /deep/ .wrapper {
    height: calc(100% - @tabBar-height);
  }

  ul {
    cursor: pointer;

    > span {
      display: flex;
      overflow: auto;
      line-height: @tabBar-height;
      background: var(--tabBar-Bg);

      > li {
        box-sizing: border-box;
        color: var(--tabBarTab-Fg);
        background: var(--tabBarTab-Bg);
        height: calc(@tabBar-height - @tabBar-underline-width);
        border-right: 1px solid var(--tabBarRightBorder-Color);
        padding: 0 1.8em 0 0.8em;
        position: relative;

        > span {
          max-width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          user-select: none;
        }

        &.active {
          border-bottom: @tabBar-underline-width solid var(--tabBarUnderline-Color);
        }

        &.inactive {
          opacity: 0.5;
        }

        &:hover {
          opacity: 0.9;
          color: var(--tabBarTab-hoverFg);
          background: var(--tabBarTab-hoverBg);
        }

        &.ghost {
          opacity: 0.5;
          color: var(--tabBarTab-Fg);
          background: var(--tabBar-inactiveBg);
        }
      }
    }
  }
}
</style>
