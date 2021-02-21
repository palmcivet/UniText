<template>
  <div>
    <div class="code">
      <span>{{ group }}</span>
      <span>.</span>
      <span>{{ field }}</span>
    </div>
    <div class="option" :title="properties.description">
      <label>{{ $g(properties.title) }}</label>
      <input type="text" v-model="res" @change="handleSubmit()" :disabled="isDisable" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TextBox" })
export default class TextBox extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;

  @Prop({ type: String, required: true })
  group!: string;

  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: String, default: false })
  val!: string;

  @Prop({ type: Boolean, default: false })
  isDisable!: boolean;

  res!: string;

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
