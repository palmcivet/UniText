<template>
  <div class="group">
    <div class="label">{{ $g(label) }}</div>
    <div class="items">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "GroupBase" })
export default class GroupBase extends Vue {
  @Prop({ type: Array, required: true })
  label!: Array<string>;
}
</script>

<style lang="less" scoped></style>
