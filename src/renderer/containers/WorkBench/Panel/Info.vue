<template>
  <section>
    <div class="date">
      <InfoCard
        :raw="file.metaInfo.createDate"
        :remark="'创建时间'"
        :type="'DATE'"
        :isCN="isCN"
      />
      <InfoCard
        :raw="file.metaInfo.modifyDate"
        :remark="'更改时间'"
        :type="'DATE'"
        :isCN="isCN"
      />
    </div>

    <div class="grid">
      <InfoCard
        :raw="file.metaInfo.wordCount"
        :remark="'词数'"
        :type="'NUM'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.metaInfo.charCount"
        :remark="'字数'"
        :type="'NUM'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.metaInfo.charCount"
        :remark="'阅读时长'"
        :type="'TIME'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.metaInfo.duration"
        :remark="'编辑时长'"
        :type="'TIME'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import InfoCard from "@/renderer/components/InfoCard.vue";
import { IFile } from "@/typings/vuex/workBench";

const workBench = namespace("workBench");

@Component({
  name: "Info",
  components: {
    InfoCard,
  },
})
export default class Info extends Vue {
  @workBench.Getter("currentFile")
  currentFile!: { order: string; value: IFile };

  get file() {
    return this.currentFile.value;
  }

  // DEV i18n
  get isCN() {
    return true;
  }

  // DEV 转移到状态栏
  get read() {
    return this.isCN ? "阅读时长" : "Read Time";
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

section {
  .grid {
    display: flex;
    flex-flow: row;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
