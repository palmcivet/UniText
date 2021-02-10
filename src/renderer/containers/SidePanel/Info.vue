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
        :remark="$t('panel.word_count')"
        :type="'NUM'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.charCount"
        :remark="$t('panel.char_count')"
        :type="'NUM'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.readTime"
        :remark="$t('panel.read_time')"
        :type="'TIME'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
      <InfoCard
        :raw="file.editTime"
        :remark="$t('panel.edit_time')"
        :type="'TIME'"
        :style="{ width: 'calc(50% - 8px)' }"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import InfoCard from "@/renderer/components/Panel/InfoCard.vue";
import { IFile } from "@/typings/vuex/workBench";
import { EI18n } from "@/typings/service/preference";

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
section {
  height: 100%;
  color: var(--sidePanel-Fg);
  background: var(--sidePanel-Bg);

  .grid {
    display: flex;
    flex-flow: row;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
