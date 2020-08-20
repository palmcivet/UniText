<template>
  <keep-alive v-if="fixed">
    <component v-show="!panelFloat && showPanel" :is="panelType" />
  </keep-alive>
  <section v-else v-show="panelFloat && showPanel">
    <div v-if="panelType === 'TOC'" class="float">
      <span ref="drag" title="拖拽" @click="handleClick($event)"></span>
      <TOC />
      <span ref="resize"></span>
    </div>
    <div v-else class="panel">
      <keep-alive>
        <component :is="panelType" />
      </keep-alive>
      <section class="arrow">
        <span :style="{ right: `${arrowPos}px` }"></span>
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import TOC from "@/component/Panel/Toc/Index.vue";
import INFO from "@/component/Panel/Info/Index.vue";
import EXPORT from "@/component/Panel/Export/Index.vue";
import { IGeneralState, EPanelType } from "@/interface/vuex/general";
import { $ } from "@/common/editor/utils";

const general = namespace("general");

// DEV
const titleMap = {
  TOC: "大纲",
  INFO: "信息",
  EXPORT: "导出",
};

@Component({
  name: "Panel",
  components: {
    TOC,
    INFO,
    EXPORT,
  },
})
export default class Panel extends Vue {
  @Prop({
    type: Boolean,
    required: true,
  })
  fixed!: boolean;

  @general.State((state: IGeneralState) => state.appearance.showPanel)
  showPanel!: boolean;

  @general.State((state: IGeneralState) => state.appearance.panelFloat)
  panelFloat!: boolean;

  @general.State((state: IGeneralState) => state.appearance.panelType)
  panelType!: EPanelType;

  get arrowPos() {
    // FEAT i18n
    // $(`footer li[title=${this.$t(this.panelType)}]`);
    const o = $(`footer li[title=${titleMap[this.panelType]}]`);
    return $("body").offsetWidth - o.offsetLeft - o.offsetWidth + 8 / 2 - 10; // @dialog-gap/2 - @right-gap
  }

  panelHeight = 150;

  get finalHeight() {
    return this.panelHeight;
  }

  set finalHeight(value: number) {
    this.panelHeight = value;
  }

  handleClick(val: number) {
    console.log(val);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

@dialog-gap: 8px;
@right-gap: 10px;

section {
  > div {
    position: absolute;
    z-index: 99;
    box-shadow: 0px 0px 6px 1px #cfe8e89e;
    border-radius: 2px;
  }

  > div.float {
    top: 100px;
    right: 20px; // DEV
    width: 150px;
    min-height: 100px;
    max-height: 700px;
    display: flex;
    flex-direction: column;

    > span {
      width: 100%;
      clear: both;

      &:first-child {
        height: 6px;
        cursor: grab;
      }

      &:last-child {
        height: 1px;
        cursor: row-resize;
      }
    }
  }

  > div.panel {
    max-height: 80%;
    min-height: 50px;
    width: 150px;
    right: @right-gap;
    bottom: calc(@layout-bottom-bar + @dialog-gap);

    > .arrow {
      position: absolute;
      bottom: 0;
      width: 100%;

      > span {
        width: 0;
        height: 0;
        position: absolute;
        border-style: solid;
        border-width: @dialog-gap;
        border-color: rgb(226, 226, 226) transparent transparent transparent;
      }
    }
  }
}
</style>
