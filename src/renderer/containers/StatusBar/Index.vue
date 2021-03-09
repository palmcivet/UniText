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
import { Vue, Component } from "vue-property-decorator";

import Mode from "./items/Mode.vue";
import Message from "./items/Message.vue";
import TagList from "./items/TagList.vue";
import PanelType from "./items/PanelType.vue";
import PanelStyle from "./items/PanelStyle.vue";
import SyncStatus from "./items/SyncStatus.vue";
import SyncScheme from "./items/SyncScheme.vue";

const Space = {
  template: `<span style="width: ${0.5}em;"></span>`,
};

@Component({
  name: "StatusBar",
  components: {
    PanelStyle,
    PanelType,
    Message,
    Space,
    Mode,
    TagList,
    SyncStatus,
    SyncScheme,
  },
})
export default class StatusBar extends Vue {
  leftGroup = ["SyncScheme", "Space", "SyncStatus", "TagList"];
  rightGroup = ["Message", "Space", "PanelType", "Space", "PanelStyle", "Mode"];
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

footer {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: @layout-statusBar-height;
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
      line-height: @layout-statusBar-height;

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
