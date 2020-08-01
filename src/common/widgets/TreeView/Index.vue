<template>
  <ul @mouseenter="handleMouseEnter()" @mouseleave="handleMouseLeave()">
    <tree-item
      v-for="(child, index) in data"
      :key="index"
      :itemData="child"
      :treeDeepth="deepth"
      :showIndent="indent"
      :notCollapse="toggle"
    ></tree-item>
  </ul>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ITreeItem } from "@/interface/view";
import TreeItem from "./TreeItem.vue";

@Component({
  name: "TreeView",
  components: {
    TreeItem,
  },
})
export default class TreeView extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  data!: Array<ITreeItem>;

  @Prop({
    type: Number,
    default: 1,
  })
  deepth!: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  toggle!: boolean;

  indent = true;

  handleMouseEnter() {
    this.indent = true;
  }

  handleMouseLeave() {
    this.indent = false;
  }
}
</script>

<style lang="less" scoped>
ul {
  margin: 0;
  height: 100%;
  overflow: auto;
}
</style>
