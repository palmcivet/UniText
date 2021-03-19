<template>
  <div class="wrapper" ref="wrapper">
    <div :style="{ width: leftWidth }" v-show="showLeft"><slot name="left" /></div>
    <span class="unitext-resize" ref="resize" v-show="showLeft && showRight" />
    <div :style="{ width: rightWidth }" v-show="showRight"><slot name="right" /></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "SplitView" })
export default class SplitView extends Vue {
  /**
   * @member 是否显示左边区域
   */
  @Prop({ type: Boolean, required: true })
  showLeft!: boolean;

  /**
   * @member 是否显示右边区域
   */
  @Prop({ type: Boolean, required: true })
  showRight!: boolean;

  /**
   * @member 阈值，一个比例参数
   */
  @Prop({ type: Number })
  threshold!: number;

  /**
   * @member 是否显示右边区域
   */
  @Prop({ type: Boolean, required: true })
  isVertical!: boolean;

  get range() {
    return [this.wraperWidth * this.threshold, this.wraperWidth * (1 - this.threshold)];
  }

  finalWidth = 0;

  wraperWidth = 0;

  get leftWidth() {
    return this.showLeft && this.showRight
      ? `${this.finalWidth}px`
      : this.showLeft
      ? "100%"
      : "0%";
  }

  get rightWidth() {
    return this.showLeft && this.showRight
      ? `calc(100% - ${this.finalWidth}px)`
      : this.showRight
      ? "100%"
      : "0%";
  }

  observer = new ResizeObserver(() => this.handleResize());

  handleResize() {
    const ratio = this.finalWidth / this.wraperWidth;
    this.wraperWidth = (this.$refs.wrapper as HTMLElement).clientWidth;
    this.finalWidth = ratio * this.wraperWidth;
  }

  mounted() {
    let start = [0, 0];
    let imWidth = this.finalWidth;
    let startWidth = imWidth;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (this.isVertical) {
        imWidth = startWidth + e.clientX - start[0];
      } else {
        imWidth = startWidth + e.clientY - start[1];
      }

      if (imWidth < this.range[0]) {
        this.finalWidth = this.range[0];
      } else if (imWidth > this.range[1]) {
        this.finalWidth = this.range[1];
      } else {
        this.finalWidth = imWidth;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMoveHandler, false);
      document.removeEventListener("mouseup", mouseUpHandler, false);
      if (imWidth >= this.range[0] && imWidth <= this.range[1]) {
        this.finalWidth = imWidth;
      }
    };

    const mouseDownHandler = (e: MouseEvent) => {
      start = [e.clientX, e.clientY];
      startWidth = this.finalWidth;
      document.addEventListener("mousemove", mouseMoveHandler, false);
      document.addEventListener("mouseup", mouseUpHandler, false);
    };

    this.$nextTick(() => {
      const { resize, wrapper } = this.$refs;

      (resize as HTMLElement).addEventListener("mousedown", mouseDownHandler);

      this.wraperWidth = (wrapper as HTMLElement).clientWidth;
      this.finalWidth = this.wraperWidth * 0.5;
      this.observer.observe(wrapper as HTMLElement);
    });
  }

  beforeDestroy() {
    this.observer.unobserve(this.$refs.wrapper as HTMLElement);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.wrapper {
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
