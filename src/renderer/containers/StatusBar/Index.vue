<template>
  <footer>
    <ul class="left-status-bar">
      <component v-for="(v, i) in leftGroup" :is="v" :key="i" />
    </ul>
    <ul class="right-status-bar">
      <component v-for="(v, i) in rightGroup" :is="v" :key="i" />
    </ul>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import Mode from "./items/Mode.vue";
// import Message from "./items/Message.vue";
// import TagList from "./items/TagList.vue";
// import PanelType from "./items/PanelType.vue";
// import PanelStyle from "./items/PanelStyle.vue";
// import SyncScheme from "./items/SyncScheme.vue";

const Space = {
  name: "Space",
  template: `<span style="width: ${0.5}em;"></span>`,
};

export default defineComponent({
  name: "StatusBar",

  components: {
    // PanelStyle,
    // PanelType,
    // Message,
    // Space,
    // Mode,
    // TagList,
    // SyncScheme,
  },

  data() {
    // <i class="ri-history-line"></i>

    return {
      leftGroup: ["SyncScheme", "Space", "TagList"],
      rightGroup: ["Message", "Space", "PanelType", "Space", "PanelStyle", "Mode"],
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

footer {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: @layout-statusbar-height;
  padding: 0 0.5em;
  color: var(--statusBar-Fg);
  background: var(--statusBar-Bg);

  .left-status-bar,
  .right-status-bar {
    display: flex;

    /deep/ ol {
      display: flex;
    }

    /deep/ li {
      padding: 0 0.25em;
      cursor: pointer;
      user-select: none;
      line-height: @layout-statusbar-height;

      &:hover {
        color: var(--statusBar-hoverFg);
        background: var(--statusBar-hoverBg);
      }

      i {
        line-height: 24px;
        font-size: 16px;
      }
    }

    &:last-child {
      flex-direction: row-reverse;
    }
  }
}
</style>
