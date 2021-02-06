<template>
  <ol>
    <li v-for="(tag, idx) in tagGroup" :key="idx" :title="tag"># {{ tag }}</li>
    <li :title="$t('status.tag_add')"><i class="ri-add-line" /></li>
  </ol>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import { IFile } from "@/typings/vuex/workBench";

const workBench = namespace("workBench");

@Component({
  name: "TagList",
})
export default class TagList extends Vue {
  @workBench.Getter("currentFile")
  currentFile!: { order: string; value: IFile };

  get tagGroup() {
    return this.currentFile.value.config.tag;
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

ol > li {
  border-radius: @layout-statusBar-height;
}
</style>
