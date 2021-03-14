<template>
  <div class="layout-wrapper" :style="{ width: `${wrapperWidth}px` }">
    <div :style="{ width: `${leftWidth}px` }"><slot name="left" /></div>
    <span ref="resize" :style="{ width: `${sashWidth}px` }" />
    <div :style="{ width: `${rightWidth}px` }"><slot name="right" /></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "LayoutView" })
export default class LayoutView extends Vue {
  /**
   * @member 是否左边为活动区域
   */
  @Prop({ type: Boolean, required: true })
  isLeft!: boolean;

  /**
   * @member 是否收起活动区域
   */
  @Prop({ type: Boolean, required: true })
  isHidden!: boolean;

  /**
   * @member 阈值，一个参数或数组 [最小值, 最大值]
   */
  @Prop({ type: Array })
  threshold!: [number, number];

  /**
   * @member 容器宽度
   */
  @Prop({ type: Number, required: true })
  wrapperWidth!: number;

  sashWidth = 2;

  flexWidth = 0;

  get leftWidth() {
    if (this.isLeft) {
      return this.isHidden ? 0 : this.flexWidth;
    } else {
      return this.isHidden
        ? this.wrapperWidth - this.sashWidth
        : this.wrapperWidth - this.sashWidth - this.flexWidth;
    }
  }

  get rightWidth() {
    if (this.isLeft) {
      return this.isHidden
        ? this.wrapperWidth - this.sashWidth
        : this.wrapperWidth - this.sashWidth - this.flexWidth;
    } else {
      return this.isHidden ? 0 : this.flexWidth;
    }
  }

  mounted() {
    let startX = 0;
    let imWidth = this.flexWidth;
    let startWidth = imWidth;

    const mouseMoveHandler = (e: MouseEvent) => {
      const offset = e.clientX - startX;
      imWidth = startWidth + (this.isLeft ? offset : -offset);
      if (imWidth < this.threshold[0]) {
        this.flexWidth = this.threshold[0];
      } else if (imWidth > this.threshold[1]) {
        this.flexWidth = this.threshold[1];
      } else {
        this.flexWidth = imWidth;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMoveHandler, false);
      document.removeEventListener("mouseup", mouseUpHandler, false);
      if (imWidth >= this.threshold[0] && imWidth <= this.threshold[1]) {
        this.flexWidth = imWidth;
      }
    };

    const mouseDownHandler = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = this.flexWidth;
      document.addEventListener("mousemove", mouseMoveHandler, false);
      document.addEventListener("mouseup", mouseUpHandler, false);
    };

    this.flexWidth = this.threshold[0];

    (this.$refs.resize as HTMLElement).addEventListener(
      "mousedown",
      mouseDownHandler,
      false
    );
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.layout-wrapper {
  width: 100%;
  height: 100%;
  display: flex;

  > span {
    width: 2px;
    height: 100%;
    cursor: col-resize;
    background: var(--titleBar-activeBg);

    &:hover {
      &::before {
        position: absolute;
        width: 4px;
      }
    }
  }
}
</style>
