<template>
  <section>
    <ul>
      <!-- <li v-for="(item, index) in tocTree" :key="index"></li> -->
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ITocList } from "@/common/helpers/create-toc";
import { ITocTree } from "@/interface/pannel";
import { BUS_TOC } from "@/common/busChannel";

@Component({
  name: "Toc",
  components: {},
})
export default class Toc extends Vue {
  tocList!: Array<ITocList>;

  levelStart = 2;

  levelEnd = 6;

  getTree(list: Array<ITocList>): Array<ITocTree> {
    const res: Array<ITocTree> = [];
    res.push({ sub: [], ...list[0] });
    const stack: Array<ITocTree[]> = [res];

    for (let i = 1, l = list.length; i < l; i++) {
      const element = list[i];
      if (element.level < list[i - 1].level) {
        /* 父标题，栈顶的数组出栈，插入到上一级 */
        const t = stack.pop();
        const s = stack[stack.length - 1];
        s[s.length - 1].sub = t as ITocTree[];
        /* 子标题，将当前父元素的 `sub` 入栈 */
      } else if (element.level > list[i - 1].level) {
        const s = stack[stack.length - 1];
        s[s.length - 1].sub = [];
        stack.push(s[s.length - 1].sub);
      }
      /* 插入到栈顶的元素 */
      stack[stack.length - 1].push({ sub: [], ...element });
    }

    return res;
  }

  mounted() {
    this.$bus.$on(BUS_TOC.SYNC_TOC, (value: Array<ITocList>) => {
      this.getTree(value);
    });
  }

  beforeDestroy() {
    this.$bus.$off(BUS_TOC.SYNC_TOC);
  }
}
</script>

<style lang="less" scoped></style>
