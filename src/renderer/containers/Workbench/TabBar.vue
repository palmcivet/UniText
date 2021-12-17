<template>
  <ul class="tab-bar" ref="tabbarRef" @wheel="onWheel($event)" @dblclick="onCreate()">
    <transition-group type="transition" :name="!isDragging ? 'flip-list' : null">
      <TabBarItem
        v-for="(tab, index) in tabList"
        :tab="tab"
        :key="index"
        @close-tab="onClose(index, tab)"
        @select-tab="onSelect(index, tab)"
        @context-tab="onContext(index, tab)"
      />
    </transition-group>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { storeToRefs } from "pinia";

import useWorkbench from "@/renderer/stores/workbench";
import TabBarItem from "./TabBarItem.vue";

export default defineComponent({
  name: "TabBar",

  inject: ["$workbench"],

  components: {
    TabBarItem,
  },

  setup() {
    const isDragging = ref(false);
    const tabbarRef = ref<HTMLElement>();

    const workbench = useWorkbench();
    const { tabList } = storeToRefs(workbench);

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;

      const newLeft = Math.max(
        0,
        Math.min(tabbarRef.value!.scrollLeft + delta, tabbarRef.value!.scrollWidth)
      );

      tabbarRef.value!.scrollLeft = newLeft;
    };

    return {
      isDragging,
      tabbarRef,
      tabList,
      onWheel,
    };
  },

  methods: {
    onSelect(index: number, event: any) {
      this.$workbench.doActivateTab(index);
    },

    onClose(index: number, event: any) {
      this.$workbench.doCloseTab(index);
    },

    onContext(index: number, event: any) {
      // TODO context
    },

    onCreate() {
      this.$workbench.doCreateMarkdown();
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.tab-bar {
  cursor: grab;
  display: flex;
  width: 100%;
  overflow-x: overlay;
  line-height: @tabBar-height;
  background: var(--tabBar-Bg);
}
</style>
