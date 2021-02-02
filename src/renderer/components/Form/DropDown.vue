<template>
  <div>
    <div class="code">{{ field }}</div>
    <div class="option">
      <label>{{ $g(properties.title) }}</label>
      <select>
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
  field!: string;
}
</script>

<style lang="less" scoped>
@import "./style.less";

.option {
  select {
    max-width: 15em;
  }
}
</style>
