<template>
  <keep-alive v-if="fixed">
    <component v-show="!panelFloat && showPanel" :is="panelType" />
  </keep-alive>
  <section v-else v-show="panelFloat && showPanel">
    <div
      v-if="panelType === 'TOC'"
      class="float"
      :style="{ top: `${panelAxis.y}px`, left: `${panelAxis.x}px` }"
    >
      <span id="drag" title="拖拽"></span>
      <TOC :style="{ height: `${panelHeight}px` }" />
      <span id="resize" title="缩放"></span>
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

  minHeight = 100;

  maxHeight = 900;

  panelHeight = 60;

  panelAxis = {
    x: 1120,
    y: 100,
  };

  mounted() {
    this.$nextTick(() => {
      let drag = false;
      let revision = 0;
      let startY = 0;
      let leftSide = this.panelHeight;
      let startHeight = leftSide;

      const mouseMoveHandler = (e: MouseEvent) => {
        const offset = e.clientY - startY;
        leftSide = startHeight + offset;
        if (leftSide < this.minHeight) {
          this.panelHeight = this.minHeight;
        } else if (leftSide > this.maxHeight) {
          this.panelHeight = this.maxHeight;
        } else {
          this.panelHeight = leftSide;
        }
      };

      const mouseUpHandler = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandler, false);
        if (
          this.panelHeight - leftSide >= this.panelHeight &&
          this.panelHeight - leftSide <= this.panelHeight
        ) {
          this.panelHeight = leftSide;
        }
      };

      const mouseDownHandler = (e: MouseEvent) => {
        startY = e.clientY;
        startHeight = this.panelHeight;
        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("mouseup", mouseUpHandler, false);
      };

      const dragDownHandler = (e: MouseEvent) => {
        drag = true;
        revision = e.clientX - this.panelAxis.x;
        document.addEventListener("mousemove", dragMoveHandler, false);
        document.addEventListener("mouseup", dragUpHandler, false);
      };

      const dragMoveHandler = (e: MouseEvent) => {
        this.panelAxis.y = e.clientY;
        this.panelAxis.x = e.clientX - revision;
      };

      const dragUpHandler = (e: MouseEvent) => {
        document.removeEventListener("mousemove", dragMoveHandler, false);
        drag = false;
      };

      $("#drag").addEventListener("mousedown", dragDownHandler, false);
      $("#resize").addEventListener("mousedown", mouseDownHandler, false);
    });
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
    width: 150px;
    display: flex;
    flex-direction: column;

    > span {
      width: 100%;
      clear: both;

      &:first-child {
        height: 8px;
        cursor: grab;
      }

      &:last-child {
        height: 2px;
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
