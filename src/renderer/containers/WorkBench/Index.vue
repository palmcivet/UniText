<template>
  <LayoutBox
    :totalWidth="containerWidth"
    :showMinor="isShowPanel && !isPanelFloat"
    :threWidth="[150, 250]"
  >
    <template v-slot:left>
      <section>
        <Tabs
          v-show="!isBlank"
          :openedFile="currentIndex"
          :tabGroup="currentTabs"
          @newFile="NEW_FILE()"
          @switchTabs="SWITCH_TABS($event)"
          @selectTab="SELECT_TAB({ cur: $event })"
          @closeTab="handleClose($event)"
        />
        <Blank v-show="isBlank" @newFile="NEW_FILE()" />
        <MarkdownSource v-show="!isBlank" class="workbench" />
      </section>
    </template>
    <template v-slot:right>
      <panel :fixed="true" />
    </template>
  </LayoutBox>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Tabs from "./Tabs.vue";
import Blank from "./Blank.vue";
import Panel from "./Panel/Index.vue";
import MarkdownSource from "./Editor/MarkdownSource/Index.vue";
import LayoutBox from "@/renderer/components/LayoutBox.vue";
import { TTab } from "@/typings/vuex/workBench";
import { IDocument } from "@/typings/document";
import { IGeneralState } from "@/typings/vuex/general";
import { BUS_FILE, BUS_UI } from "@/common/channel";

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
  @workBench.State("currentIndex")
  currentIndex!: string;

  @workBench.State("currentTabs")
  currentTabs!: Array<TTab>;

  @workBench.Mutation("SWITCH_TABS")
  SWITCH_TABS!: (value: Array<IDocument>) => void;

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

  handleClose(index: string) {
    this.CLOSE_FILE(index);
    this.$bus.emit(BUS_FILE.CLOSE_FILE, index);
  }

  handleResize() {
    this.containerWidth = (this.$el as HTMLElement).offsetWidth;
  }

  created() {
    // TODO 检测设置并新建
    this.NEW_FILE();
  }

  mounted() {
    this.$nextTick(() => {
      this.containerWidth = (this.$el as HTMLElement).offsetWidth;
      this.$bus.on(BUS_UI.SYNC_RESIZE, this.handleResize);
    });
  }

  beforeDestroy() {
    this.$bus.off(BUS_UI.SYNC_RESIZE, this.handleResize);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

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
