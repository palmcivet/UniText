<template>
  <section>
    <li v-for="(item, index) in tocTree" :key="index" @click.stop="revealLine(item.line)">
      <div v-for="i in item.level - firstLevel - 1" :key="i" />
      <pre></pre>
      {{ item.content }}
    </li>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { ITocList } from "@/common/helpers/create-toc";
import { BUS_TOC } from "@/common/busChannel";

@Component({
  name: "Toc",
})
export default class Toc extends Vue {
  @Prop({
    type: Number,
    default: 1,
  })
  firstLevel!: number;

  tocTree: Array<ITocList> = [];

  revealLine(value: Array<number>) {
    this.$bus.$emit(BUS_TOC.REVEAL_SECTION, value);
  }

  mounted() {
    this.$nextTick(() => {
      this.$bus.$on(BUS_TOC.SYNC_TOC, (value: Array<ITocList>) => {
        this.tocTree = value;
      });
    });
  }

  beforeDestroy() {
    this.$bus.$off(BUS_TOC.SYNC_TOC);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

@line-height: 1em;

* {
  -webkit-user-select: none;
  font-family: @edit-font-family;
}

section {
  height: 100%;
  width: 100%;
  margin-bottom: 0;
  overflow-y: auto;
  padding: 0.2em 0.1em;
  background-color: #f7f7f7; // DEV

  li {
    list-style: none;
    cursor: pointer;
    display: -webkit-box;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      background-color: #e2dac3;
    }

    div {
      width: 0.6em;
      border-right: 0.3px solid rgba(126, 126, 126, 0.9);
    }

    pre {
      margin: 0;
      width: 0.3em;
    }
  }
}
</style>
