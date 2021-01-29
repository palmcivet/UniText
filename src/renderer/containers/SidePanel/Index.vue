<template>
  <keep-alive v-if="fixed">
    <component v-show="!panelFloat && showPanel" :is="panelType" />
  </keep-alive>
  <section v-else v-show="panelFloat && showPanel">
    <div v-if="panelType === 'TOC'" class="float" :style="panelPos">
      <span id="drag" :title="$t('ui.drag')" />
      <TOC :style="{ height: `${panelHeight}px` }" />
      <span id="resize" :title="$t('ui.resize')" />
    </div>
    <div v-else class="panel">
      <keep-alive>
        <component :is="panelType" />
      </keep-alive>
      <section class="arrow">
        <span :style="{ right: `${arrowPos}px` }" />
      </section>
    </div>
  </section>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

import TOC from "./Toc.vue";
import INFO from "./Info.vue";
import EXPORT from "./Export.vue";
import { IGeneralState, EPanelType } from "@/typings/vuex/general";
import { $ } from "@/common/utils";

const general = namespace("general");

@Component({
  name: "SidePanel",
  components: {
    TOC,
    INFO,
    EXPORT,
  },
})
export default class SidePanel extends Vue {
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
    const o = $(`footer li[title=${this.$t("status." + this.panelType)}]`);
    // @dialog-gap/2 - @right-gap
    return $("body").offsetWidth - o.offsetLeft - o.offsetWidth + 8 / 2 - 10;
  }

  minHeight = 100;

  maxHeight = 600;

  panelHeight = 120;

  panelAxis = {
    x: 1080,
    y: 100,
  };

  get panelPos() {
    return {
      right: `${Math.abs($("body").offsetWidth - 150 - this.panelAxis.x)}px`,
      top: `${this.panelAxis.y}px`,
    };
  }

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
@import "~@/renderer/styles/var.less";

@dialog-gap: 8px;
@right-gap: 10px;

section {
  > div {
    position: absolute;
    z-index: 99;
    border-radius: 2px;
    box-shadow: -3px 3px 10px #e6e6e6;
  }

  > div.float {
    width: 150px;
    display: flex;
    flex-direction: column;

    > span {
      width: 100%;
      clear: both;

      &:first-child {
        height: 7px;
        background-color: #f0f0f0;
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
    background-color: white;
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
