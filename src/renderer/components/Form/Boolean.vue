<template>
  <div @click="handleCheck()">
    <div class="code">{{ field }}</div>
    <div class="option">
      <input type="checkbox" :checked="value" />
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
  field!: string;

  @Prop({ type: Boolean, default: false })
  value!: boolean;

  handleCheck() {}
}
</script>

<style lang="less" scoped>
@import "./style.less";

.option {
  flex-direction: row;
  align-items: center;
}
</style>
