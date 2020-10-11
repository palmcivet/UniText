<template>
  <section>
    <div v-show="tocTree.length === 0">目录为空</div>
    <VueCustomScrollbar
      v-show="tocTree.length !== 0"
      tagname="ul"
      :settings="{
        swipeEasing: 'true',
        scrollingThreshold: '300',
      }"
    >
      <li
        v-for="(item, index) in tocTree"
        :key="index"
        @click.stop="handleRevealLine(item.line)"
        @contextmenu="handleContextToc(item)"
      >
        <div v-for="i in item.level - firstLevel" :key="i" />
        <pre />
        {{ item.content }}
      </li>
    </VueCustomScrollbar>
  </section>
</template>

<script lang="ts">
import { State, namespace } from "vuex-class";
import VueCustomScrollbar from "vue-custom-scrollbar";
import { Vue, Component, Prop } from "vue-property-decorator";

import { TContext } from "@/app/main/menu/context";
import { ITocList } from "@/common/editor/create-toc";
import { BUS_TOC } from "@/common/channel";
import { remote } from "electron";

const panel = namespace("panel");
const general = namespace("general");

@Component({
  name: "Toc",
  components: {
    VueCustomScrollbar,
  },
})
export default class Toc extends Vue {
  @Prop({
    type: Number,
    default: 2,
  })
  firstLevel!: number;

  @panel.State("toc")
  tocTree!: Array<ITocList>;

  @panel.Mutation("SYNC_TOC")
  SYNC_TOC!: (value: Array<ITocList>) => void;

  @general.State("context")
  context!: TContext;

  handleRevealLine(value: Array<number>) {
    this.$bus.$emit(BUS_TOC.REVEAL_SECTION, value);
  }

  handleContextToc(value: ITocList) {
    this.context.toc.popup({
      window: remote.getCurrentWindow(),
    });
  }

  mounted() {
    this.$nextTick(() => {
      this.$bus.$on(BUS_TOC.SYNC_TOC, (value: Array<ITocList>) => {
        this.SYNC_TOC(value);
      });
    });
  }

  beforeDestroy() {
    this.$bus.$off(BUS_TOC.SYNC_TOC);
  }
}
</script>

<style lang="less" scoped>
@import "~@/styles/var.less";
@import "~@/styles/widget.less";

@line-height: 1em;

* {
  -webkit-user-select: none;
  font-family: @normal-font-family;
}

section {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #f7f7f7; // DEV

  > div {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, calc(50% - 1em));
  }

  li {
    cursor: pointer;
    display: -webkit-box;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      background-color: #e2dac3;
    }

    div {
      width: 0.6em;
      border-right: 0.3px none;
    }

    pre {
      margin: 0;
      width: 0.3em;
    }
  }
}
</style>
