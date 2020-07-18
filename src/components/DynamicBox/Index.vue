<template>
  <div
    :style="{
      display: 'flex',
      width: '100%',
      transform: isHorizontal ? 'rotate(180)' : '',
    }"
  >
    <section :style="{ width: isLeft ? `${leftWidth}${widthUnit}` : rightWidth }">
      <slot name="left">Left</slot>
    </section>
    <span
      :class="isHorizontal ? 'hor' : 'ver'"
      @mousedown="handleDragDown($event)"
    ></span>
    <section :style="{ width: !isLeft ? `${leftWidth}${widthUnit}` : rightWidth }">
      <slot name="right">Right</slot>
    </section>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class DynamicBox extends Vue {
  @Prop({
    type: Number,
    required: true,
  })
  readonly minWidth!: number;

  @Prop({
    type: Number,
    required: true,
  })
  readonly maxWidth!: number;

  @Prop({
    type: Number,
  })
  readonly defaultWidth?: number;

  @Prop({
    type: String,
    default: "px",
    validator: (value: string) => {
      return ["px", "em", "rem", "vh", "vw"].indexOf(value) !== -1;
    },
  })
  readonly widthUnit!: String;

  @Prop({
    type: Boolean,
    default: true,
  })
  readonly isHorizontal!: Boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  readonly isLeft!: boolean;

  get curWidth() {
    return this.leftWidth;
  }

  set curWidth(value: number) {
    this.leftWidth = value;
  }

  leftWidth = this.defaultWidth ? this.minWidth : this.maxWidth;

  rightWidth = "100%";

  // 水平为 "1"；垂直为 "0"
  axisMode: "1" | "0" = this.isHorizontal ? "1" : "0";

  // 是否处于拖拽状态
  dragging = false;

  // 根据 `axisMode` 动态赋值
  startPoint: {
    [index in "0" | "1"]: number;
  } = {
    "1": 0,
    "0": 0,
  };

  handleDragDown(e: MouseEvent) {
    const originWidth = this.curWidth;
    this.dragging = true;
    this.startPoint = {
      "1": e.clientX,
      "0": e.clientY,
    };

    document.body.style.cursor = this.isHorizontal ? "col-resize" : "row-resize";

    document.onmousemove = (event: MouseEvent) => {
      if (this.dragging) {
        const movePath =
          {
            "1": event.clientX,
            "0": event.clientY,
          }[this.axisMode] - this.startPoint[this.axisMode];
        console.log(this.startPoint["1"]);
        console.log(event.clientX - this.startPoint["1"]);
        console.log(movePath);

        if (this.curWidth + movePath < this.minWidth) {
          this.curWidth = this.minWidth;
        } else if (this.curWidth + movePath > this.maxWidth) {
          this.curWidth = this.maxWidth;
        } else {
          this.curWidth = originWidth + movePath;
        }
      }
    };

    document.onmouseup = (event: MouseEvent) => {
      this.dragging = false;
      document.onmousemove = null;
      document.onmouseup = null;
      document.body.style.cursor = "auto";
    };
    e.stopPropagation();
  }
}
</script>

<style lang="less" scoped>
span.hor:hover {
  cursor: col-resize;
}

span.ver:hover {
  cursor: row-resize;
}

span {
  width: 2px;
  height: 100%;
  background-color: rgba(226, 226, 226, 0.7);

  &:hover {
    background-color: rgba(175, 175, 175, 0.7); // DEV
  }
}
</style>
