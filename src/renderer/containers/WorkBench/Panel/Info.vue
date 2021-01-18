<template>
  <section>
    <div class="date">
      <InfoCard
        :raw="file.created"
        :remark="$t('panel.created')"
        :type="'DATE'"
        :isCN="isCN"
      />
      <InfoCard
        :raw="file.modified"
        :remark="$t('panel.modified')"
        :type="'DATE'"
        :isCN="isCN"
      />
    </div>

    <div class="grid">
      <InfoCard
        :raw="file.wordCount"
        :remark="$t('panel.wordCount')"
        :type="'NUM'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.charCount"
        :remark="$t('panel.charCount')"
        :type="'NUM'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.readTime"
        :remark="$t('panel.readTime')"
        :type="'TIME'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.editTime"
        :remark="$t('panel.editTime')"
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
import { EI18n } from "@/typings/bootstrap";

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
    return this.currentFile.value.metaInfo;
  }

  get isCN() {
    return this.$i18n.lang === EI18n.ZH_CN;
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
