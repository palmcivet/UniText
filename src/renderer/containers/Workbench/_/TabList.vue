<template>
  <Draggable
    tag="ul"
    class="tab-list"
    ref="container"
    v-model="openedTabs"
    v-bind="dragOptions"
    :component-data="componentData()"
    @start="isDragging = true"
    @end="isDragging = false"
  >
    <transition-group type="transition" :name="!isDragging ? 'flip-list' : null">
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
</template>

<script>
import { defineComponent } from "vue";
import Draggable from "vuedraggable";

defineComponent({
  name: "TabList",

  components: {
    Draggable,
  },

  data() {
    return {
      isDragging: false,
      dragOptions: {
        animation: 150,
        disabled: false,
        ghostClass: "ghost",
      },
      componentData: {
        on: {
          dblclick: (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
          },
        },
      },
    };
  },

  methods: {
    handleTabScroll(e: WheelEvent) {
      let delta = e.deltaY;
      if (e.deltaX !== 0) {
        delta = e.deltaX;
      }
      const tabs = this.tabRef;
      const newLeft = Math.max(0, Math.min(tabs.scrollLeft + delta, tabs.scrollWidth));
      tabs.scrollLeft = newLeft;
    },
  },
});
</script>

<style lang="less" scoped>
.tab-list {
  cursor: pointer;

  > span {
    display: flex;
    overflow: auto;
    line-height: @tabBar-height;
    background: var(--tabBar-Bg);

    > li {
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
</style>
