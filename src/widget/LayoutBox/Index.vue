<template>
  <article>
    <div
      :style="{
        width: !showMain ? '0%' : !showMinor ? '100%' : `calc(100% - ${minorWidth}px`,
      }"
    >
      <slot name="left" />
    </div>
    <span v-show="showMinor && showMain" ref="resize"></span>
    <div
      v-show="showMinor"
      :style="{
        width: !showMain
          ? '100%'
          : minorWidth
          ? `${minorWidth - resizeWidth}px`
          : `calc(50% - ${resizeWidth} px`,
      }"
    >
      <slot name="right" />
    </div>
  </article>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "LayoutBox",
})
export default class LayoutBox extends Vue {
  /**
   * @member 容器总宽度
   */
  @Prop({ type: Number, required: true })
  totalWidth!: number;

  /**
   * @member 是否显示主区域
   */
  @Prop({ type: Boolean, default: true })
  showMain!: boolean;

  /**
   * @member 是否显示副区域
   */
  @Prop({ type: Boolean, default: false })
  showMinor!: boolean;

  /**
   * @member 阈值，一个参数或数组 [最小值, 最大值]
   */
  @Prop({
    type: [Number, Array],
    default: 1 / 4,
    validator: (value: number | [number, number]) => {
      if (typeof value === "number") {
        return value <= 1 / 2;
      } else {
        return true;
      }
    },
  })
  threWidth!: number | [number, number];

  minorWidth = 0;

  @Watch("totalWidth")
  syncWidth() {
    this.minorWidth =
      typeof this.threWidth === "number"
        ? this.totalWidth * this.threWidth
        : Math.ceil((this.threWidth[0] + this.threWidth[1]) / 2);
  }

  resizeWidth = 1.7;

  get minWidth() {
    return typeof this.threWidth === "number"
      ? this.totalWidth * this.threWidth
      : this.threWidth[0];
  }

  get maxWidth() {
    return typeof this.threWidth === "number"
      ? this.totalWidth * (1 - this.threWidth)
      : this.threWidth[1];
  }

  mounted() {
    let startX = 0;
    let leftSide = this.minorWidth;
    let startWidth = leftSide;

    const mouseMoveHandler = (e: MouseEvent) => {
      const offset = e.clientX - startX;
      leftSide = startWidth - offset;
      if (leftSide < this.minWidth) {
        this.minorWidth = this.minWidth;
      } else if (leftSide > this.maxWidth) {
        this.minorWidth = this.maxWidth;
      } else {
        this.minorWidth = leftSide;
      }
    };

    const mouseUpHandler = (e: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMoveHandler, false);
      if (
        this.totalWidth - leftSide >= this.minWidth &&
        this.totalWidth - leftSide <= this.maxWidth
      ) {
        this.minorWidth = leftSide;
      }
    };

    const mouseDownHandler = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = this.minorWidth;
      document.addEventListener("mousemove", mouseMoveHandler, false);
      document.addEventListener("mouseup", mouseUpHandler, false);
    };

    (this.$refs.resize as HTMLElement).addEventListener(
      "mousedown",
      mouseDownHandler,
      false
    );
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

article {
  width: 100%;
  height: 100%;
  display: flex;

  & > span {
    width: 1.7px;
    height: 100%;
    cursor: col-resize;
    background-color: rgba(255, 255, 255, 0.6);

    &:hover {
      border-right: @resize-bar;
    }
  }
}
</style>
