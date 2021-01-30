<template>
  <div class="boolean">
    <input type="checkbox" />
    <label>{{ $g(properties.title) }}</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "Boolean" })
export default class Boolean extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;
}
</script>

<style lang="less" scoped>
.boolean {
  display: flex;
}
</style>
