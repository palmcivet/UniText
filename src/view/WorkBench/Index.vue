<template>
  <section>
    <tabs
      v-show="!isBlank"
      :openedFile="currentFileIndex"
      :tabGroup="currentTabs"
      @newFile="NEW_FILE()"
      @switchTabs="SWITCH_TABS($event)"
      @selectTab="SELECT_TAB({ cur: $event })"
      @closeTab="handleClose($event)"
    />
    <blank v-show="isBlank" class="workbench" @newFile="NEW_FILE()" />
    <markdown-source v-show="!isBlank" class="workbench" />
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import EmojiCard from "@/common/widgets/EmojiCard/Index.vue";
import MarkdownSource from "@/view/WorkBench/MarkdownSource/Index.vue";
import Blank from "@/view/WorkBench/Blank/Index.vue";
import Tabs from "@/view/WorkBench/Tabs/Index.vue";
import { TTab } from "@/interface/vuex/workBench";
import { IDocument } from "@/interface/document";
import { IGeneralState, EPanelType } from "@/interface/vuex/general";
import { wordCount, timeCalc } from "@/common/editor/words-count";
import { BUS_FILE } from "@/common/bus-channel";

const general = namespace("general");
const workBench = namespace("workBench");

@Component({
  name: "WorkBench",
  components: {
    MarkdownSource,
    EmojiCard,
    Blank,
    Tabs,
  },
})
export default class WorkBench extends Vue {
  @workBench.State("currentFileIndex")
  currentFileIndex!: string;

  @workBench.State("currentTabs")
  currentTabs!: Array<TTab>;

  @workBench.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (value: IDocument[]) => void;

  @workBench.Mutation("SELECT_TAB")
  SELECT_TAB!: (index: string) => void;

  @workBench.Mutation("TOGGLE_MODIFY")
  TOGGLE_MODIFY!: () => void;

  @workBench.Action("CLOSE_FILE")
  CLOSE_FILE!: (index: string) => void;

  @workBench.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;

  @general.State((state: IGeneralState) => state.appearance.panelType)
  panelType!: EPanelType;

  get isBlank() {
    return this.currentTabs.length === 0;
  }

  get isToc() {
    return this.panelType === EPanelType.TOC;
  }

  getStatus() {
    const reading = timeCalc("");
    const second = Number((reading.second - (reading.minius - 1) * 60).toFixed(2));
    const formatTime = `${Math.floor(reading.second / 60)}m ${second < 60 ? second : ""}${
      second < 60 ? "s" : ""
    }`;

    let wordsNumber = 0;
    wordCount("", (count: number) => {
      wordsNumber = count;
    });

    return {
      formatTime,
      wordsNumber: Array.isArray(wordsNumber) ? 0 : wordsNumber,
    };
  }

  handleClose(index: string) {
    this.CLOSE_FILE(index);
    this.$bus.$emit(BUS_FILE.CLOSE_FILE, index);
  }

  created() {
    this.NEW_FILE();
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.workbench {
  height: 100%;
  width: 100%;
}
</style>
