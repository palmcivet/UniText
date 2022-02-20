<template>
  <ul class="panel-toc">
    <div class="toc-empty" v-if="isNoToc">
      <!-- DEV -->
      目录为空
    </div>
    <template v-else>
      <li
        class="toc-item"
        v-for="(item, index) in tocList"
        :key="index"
        @click.stop="onClick(item.line)"
        @contextmenu="onContext(item)"
      >
        <div
          class="toc-item__indent"
          :style="{ width: `${(item.level - tocFirstLevel) * 0.8}em` }"
        />
        {{ item.content }}
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import { storeToRefs } from "pinia";
import { computed, defineComponent, ref } from "vue";
import useWorkbench from "@/renderer/stores/workbench";
import { BUS_CHANNEL } from "@/shared/channel";
import { useService } from "@/renderer/composables";

export default defineComponent({
  name: "Toc",

  inject: ["$bus"],

  props: {},

  setup() {
    const { tocList } = storeToRefs(useWorkbench());
    const tocFirstLevel = ref(2); // TODO 接受 setting 的参数

    return {
      tocList,
      tocFirstLevel,
      isNoToc: computed(() => tocList.value.length === 0),
    };
  },

  methods: {
    onClick(event: any) {
      this.$bus.emit(BUS_CHANNEL.EDITOR_REVEAL_SECTION, event);
    },

    onContext() {
      useService("MenuService").popupContextMenu([
        { id: "context.toc.setHeadUp" },
        { id: "context.toc.setHeadDown" },
        { type: "-" },
        { id: "context.toc.renameTitle" },
      ]);
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";
@import "~@/renderer/styles/mixins.less";

.panel-toc {
  height: 100%;
  overflow-y: overlay;
  position: relative;

  .toc-empty {
    height: 100%;
    width: 100%;
    font-size: 1.3em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  .toc-item {
    cursor: pointer;
    padding: 3px 0;
    font-size: 16px;
    width: 100%;
    font-family: var(--normal-font-family);
    user-select: none;
    .ellipsis();

    &:hover {
      color: var(--u-workbench-toc-hover-fg);
      background-color: var(--u-workbench-toc-hover-bg);
    }

    &__indent {
      height: 1em;
      display: inline-block;
    }
  }
}
</style>
