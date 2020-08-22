<template>
  <layout-box
    :totalWidth="containerWidth"
    :showMinor="isShowPanel && !isPanelFloat"
    :threWidth="[150, 250]"
  >
    <template v-slot:left>
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
        <blank v-show="isBlank" @newFile="NEW_FILE()" />
        <markdown-source v-show="!isBlank" class="workbench" />
      </section>
    </template>
    <template v-slot:right>
      <panel :fixed="true" />
    </template>
  </layout-box>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import LayoutBox from "@/component/widgets/LayoutBox/Index.vue";
import MarkdownSource from "@/component/Editor/MarkdownSource/Index.vue";
import Panel from "@/component/Panel/Index.vue";
import Blank from "@/view/WorkBench/Blank/Index.vue";
import Tabs from "@/view/WorkBench/Tabs/Index.vue";
import { TTab } from "@/interface/vuex/workBench";
import { IDocument } from "@/interface/document";
import { IGeneralState, EPanelType } from "@/interface/vuex/general";
import { wordCount, timeCalc } from "@/common/editor/words-count";
import { BUS_FILE, BUS_UI } from "@/common/bus-channel";

const general = namespace("general");
const workBench = namespace("workBench");

@Component({
  name: "WorkBench",
  components: {
    MarkdownSource,
    LayoutBox,
    Panel,
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

  @workBench.Getter("isBlank")
  isBlank!: boolean;

  @general.State((state: IGeneralState) => state.appearance.showPanel)
  isShowPanel!: boolean;

  @general.State((state: IGeneralState) => state.appearance.panelFloat)
  isPanelFloat!: boolean;

  containerWidth = 0;

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
    // TODO 检测设置并新建
    this.NEW_FILE();
  }

  mounted() {
    this.$nextTick(() => {
      this.containerWidth = (this.$el as HTMLElement).offsetWidth;
      this.$bus.$on(BUS_UI.SYNC_RESIZE, () => {
        this.containerWidth = (this.$el as HTMLElement).offsetWidth;
      });
    });
  }

  beforeDestroy() {
    this.$bus.$off(BUS_UI.SYNC_RESIZE);
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
  height: calc(100% - 25px);
  width: 100%;
}
</style>
