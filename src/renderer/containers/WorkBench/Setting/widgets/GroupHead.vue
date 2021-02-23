<template>
  <div class="code">
    <span>{{ field }}</span>
    <span>.</span>
    <span>{{ subField }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "GroupHead" })
export default class GroupHead extends Vue {
  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: String, required: true })
  subField!: string;
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.code {
  font-size: 1em;
  font-family: @code-font-family;
  display: inline-flex;
  align-items: center;

  span:last-child {
    font-size: 1.1em;
    color: var(--inputBox-Fg);
  }
}
</style>
