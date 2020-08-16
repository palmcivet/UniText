<template>
  <!-- 本组件中，父组件只用作组合，不含业务逻辑，而子组件拥有各自的逻辑，相互独立 -->
  <footer>
    <ul>
      <component v-for="(v, i) in leftGroup" :is="v" :key="i"></component>
    </ul>
    <ul>
      <component v-for="(v, i) in rightGroup" :is="v" :key="i"></component>
    </ul>
  </footer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import Notice from "./Notice/Index.vue";
import Panel from "./Panel/Index.vue";
import Mode from "./Mode/Index.vue";
import Stat from "./Stat/Index.vue";
import Sync from "./Sync/Index.vue";
import Tag from "./Tag/Index.vue";

const Space = {
  template: `<span style="width: ${1}em;"></span>`,
};

@Component({
  name: "StatusBar",
  components: {
    Notice,
    Space,
    Panel,
    Mode,
    Stat,
    Sync,
    Tag,
  },
})
export default class StatusBar extends Vue {
  leftGroup = ["Sync", "Space", "Stat", "Tag"];
  rightGroup = ["Notice", "Panel", "Mode"];
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

footer {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: 100%;
  padding: 0 0.25em;

  > ul {
    display: flex;

    /deep/ ol {
      display: flex;
    }

    /deep/ li {
      -webkit-user-select: none;
      cursor: pointer;
      padding: 0 0.3em;
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
