<template>
  <div class="option" :title="$g(prop.description)" @click.stop="handleChange()">
    <input
      type="checkbox"
      :checked="value"
      :disabled="hasDisabled"
      @change="handleChange()"
    />
    <label>{{ $g(prop.title) }}</label>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import Skeleton from "./skeleton";

@Component({ name: "UCheckBox" })
export default class UCheckBox extends Skeleton {
  handleChange() {
    this.$emit("change", !this.value);
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";

.option {
  flex-direction: row;
  align-items: center;

  &,
  * {
    cursor: pointer;
  }
}
</style>
