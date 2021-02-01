<template>
  <div>
    <label>{{ properties.title }}</label>
    <input type="text" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TextGroup" })
export default class TextGroup extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;
}
</script>

<style lang="less" scoped></style>
