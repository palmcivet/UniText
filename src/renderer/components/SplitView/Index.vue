<template>
  <div class="splitview" ref="container">
    <div :style="{ width: leftWidth }" v-show="showLeft">
      <slot name="left" />
    </div>

    <span class="splitview__sash" ref="sash" v-show="showLeft && showRight" />

    <div :style="{ width: rightWidth }" v-show="showRight">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SplitView",

  props: {
    /**
     * @member 是否显示左边区域
     */
    showLeft: { type: Boolean, required: true },
    /**
     * @member 是否显示右边区域
     */
    showRight: { type: Boolean, required: true },
    /**
     * @member 左右反转
     */
    isReverse: { type: Boolean, default: false },
    /**
     * @member 左区域初始宽度
     */
    initWidth: { type: Number },
    /**
     * @member 一个数组，左区域的阈值
     */
    threshold: { type: Array, required: true },
  },

  data() {
    return {
      finalWidth: 0,
      containerWidth: 0,
      observer: new ResizeObserver(() => this.handleResize()),
    };
  },

  computed: {
    range() {
      let [min = 1 / 2, max = 1 / 2] = this.threshold as [number, number];

      if (min > max || min < 0 || max < 0) {
        min = 1 / 2;
        max = 1 / 2;
      }

      if (min > 1 && max > 1) {
        return [min, max];
      }

      return [this.containerWidth * min, this.containerWidth * max];
    },

    leftWidth() {
      return this.showLeft && this.showRight
        ? `${this.finalWidth}px`
        : this.showLeft
        ? "100%"
        : "0%";
    },

    rightWidth() {
      return this.showLeft && this.showRight
        ? `calc(100% - ${this.finalWidth}px)`
        : this.showRight
        ? "100%"
        : "0%";
    },
  },

  methods: {
    handleResize() {
      const parentWidth = (this.$refs.container as HTMLElement).clientWidth;
      if (parentWidth === 0) {
        return;
      }
      const ratio = this.finalWidth / this.containerWidth;
      this.containerWidth = parentWidth;
      this.finalWidth = ratio * (this.containerWidth - 2);
    },
  },

  mounted() {
    let start = [0, 0];
    let immedWidth = this.finalWidth;
    let startWidth = immedWidth;

    const mouseMoveHandler = (e: MouseEvent) => {
      immedWidth = startWidth + e.clientX - start[0];

      if (immedWidth < this.range[0]) {
        this.finalWidth = this.range[0];
      } else if (immedWidth > this.range[1]) {
        this.finalWidth = this.range[1];
      } else {
        this.finalWidth = immedWidth;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMoveHandler, false);
      document.removeEventListener("mouseup", mouseUpHandler, false);
      if (immedWidth >= this.range[0] && immedWidth <= this.range[1]) {
        this.finalWidth = immedWidth;
      }
    };

    const mouseDownHandler = (e: MouseEvent) => {
      start = [e.clientX, e.clientY];
      startWidth = this.finalWidth;
      document.addEventListener("mousemove", mouseMoveHandler, false);
      document.addEventListener("mouseup", mouseUpHandler, false);
    };

    this.$nextTick(() => {
      const { sash, container } = this.$refs;

      (sash as HTMLElement).addEventListener("mousedown", mouseDownHandler);

      this.containerWidth = (container as HTMLElement).clientWidth;
      this.finalWidth = this.initWidth ?? this.range[0];
      this.observer.observe(container as HTMLElement);
    });
  },

  beforeDestroy() {
    this.observer.unobserve(this.$refs.container as HTMLElement);
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.splitview {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  @sash-width: 4px;

  &__sash {
    width: 1px; // DEV
    height: 100%;
    position: absolute;
    left: calc(v-bind(leftWidth) - @sash-width / 2);
    top: 0;
    cursor: col-resize;
    background: transparent;

    &:hover {
      width: @sash-width; // DEV
      background: var(--sash-hoverFg);
    }
  }
}
</style>