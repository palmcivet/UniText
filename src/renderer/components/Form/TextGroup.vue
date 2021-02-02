<template>
  <div>
    <div class="code">{{ field }}</div>
    <div class="option">
      <label>{{ $g(properties.title) }}</label>
      <input type="text" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TextGroup" })
export default class TextGroup extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;

  @Prop({ type: String, required: true })
  field!: string;
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
