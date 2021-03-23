<template>
  <div ref="root" style="height: 100%" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { TreeViewModel } from "@/renderer/components/Tree/treeViewModel";

@Component({
  name: "Files",
  components: {},
})
export default class Files extends Vue {
  tree!: TreeViewModel;

  mounted() {
    this.$nextTick(() => {
      this.tree = new TreeViewModel(this.$refs.root as HTMLElement);
      this.tree.render();
      (window as any).tree = this.tree;
    });
  }
}
</script>

<style lang="less" scoped>
/deep/ .view {
  button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, 50%);
    padding: 0.5em;
  }
}
</style>
