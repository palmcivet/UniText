<template>
  <div>
    <div class="code">
      <span>{{ group }}</span>
      <span>.</span>
      <span>{{ field }}</span>
    </div>
    <div class="option" :title="properties.description">
      <label>{{ $g(properties.title) }}</label>
      <select v-model="res" @change="handleSubmit()">
        <option v-for="(i, k) in properties.enum" :value="i" :key="k">{{ i }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "DropDown" })
export default class DropDown extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;

  @Prop({ type: String, required: true })
  group!: string;

  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: String, default: false })
  val!: string;

  res = this.val;

  handleSubmit() {
    this.$emit("item-change", [this.group, this.field, this.res]);
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";

select {
  cursor: pointer;
  max-width: 15em;
}
</style>
