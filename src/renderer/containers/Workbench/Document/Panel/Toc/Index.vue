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

    onContext() {},
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";
@import "~@/renderer/styles/mixins.less";

.panel-toc {
  height: 100%;
  overflow-y: auto;
  position: relative;
  color: var(--sidePanel-Fg);
  background: var(--sidePanel-Bg);

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
    font-size: 16px; // DEV
    width: 100%;
    font-family: @normal-font-family;
    user-select: none;
    .ellipsis();

    &:hover {
      color: var(--sidePanelItem-hoverFg);
      background: var(--sidePanelItem-hoverBg);
    }

    &__indent {
      height: 1em;
      display: inline-block;
    }
  }
}
</style>
