<template>
  <div class="dropdown">
    <div>{{ $g(properties.title) }}</div>
    <select>
      <option v-for="(i, k) in properties.enum" :value="i" :key="k">{{ i }}</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "DropDown" })
export default class DropDown extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;
}
</script>

<style lang="less" scoped></style>
