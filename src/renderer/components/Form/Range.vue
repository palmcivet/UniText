<template>
  <div>
    <div class="code">
      <span>{{ group }}</span>
      <span>.</span>
      <span>{{ field }}</span>
    </div>
    <div class="option" :title="properties.description">
      <label>{{ $g(properties.title) }}</label>
      <input type="number" v-model.number="res" @change="handleSubmit()" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "Range" })
export default class Range extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;

  @Prop({ type: String, required: true })
  group!: string;

  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: Number, default: false })
  val!: number;

  res!: number;

  data() {
    return {
      res: this.val,
    };
  }

  handleSubmit() {
    this.$emit("item-change", [this.group, this.field, this.res]);
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
