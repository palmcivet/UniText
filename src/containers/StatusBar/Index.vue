<template>
  <!-- 本组件中，父组件只用作组合，不含业务逻辑，而子组件拥有各自的逻辑，相互独立 -->
  <footer>
    <ul>
      <component v-for="(v, i) in leftGroup" :is="v" :key="i" />
    </ul>
    <ul>
      <component v-for="(v, i) in rightGroup" :is="v" :key="i" />
    </ul>
  </footer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import Mode from "./Mode.vue";
import Message from "./Message.vue";
import TagList from "./TagList.vue";
import PanelType from "./PanelType.vue";
import PanelStyle from "./PanelStyle.vue";
import SyncStatus from "./SyncStatus.vue";
import SyncScheme from "./SyncScheme.vue";

const Space = {
  template: `<span style="width: ${1}em;"></span>`,
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
@import "~@/styles/var.less";

footer {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 100%;
  padding: 0 0.5em;

  > ul {
    display: flex;

    /deep/ ol {
      display: flex;
    }

    /deep/ li {
      padding: 0 0.25em;
      cursor: pointer;
      -webkit-user-select: none;
      line-height: @layout-bottom-bar;

      &:hover {
        color: rgb(36, 36, 36); // DEV
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
