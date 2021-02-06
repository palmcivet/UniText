<template>
  <div @click="handleCheck()">
    <div class="code">
      <span>{{ group }}</span>
      <span>.</span>
      <span>{{ field }}</span>
    </div>
    <div class="option" :title="properties.description">
      <input type="checkbox" :checked="val" @change="handleCheck()" />
      <label>{{ $g(properties.title) }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "Boolean" })
export default class Boolean extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;

  @Prop({ type: String, required: true })
  group!: string;

  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: Boolean, default: false })
  val!: boolean;

  handleCheck() {
    this.$emit("item-change", [this.group, this.field, !this.val]);
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";

.option {
  flex-direction: row;
  align-items: center;
}
</style>
