<template>
  <div class="option" :title="$g(prop.description)">
    <label>{{ $g(prop.title) }}</label>
    <input
      type="number"
      v-model.number="res"
      :max="prop.maximum"
      :min="prop.minimum"
      :disabled="hasDisabled"
      @change="handleChange()"
    />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import Skeleton from "./skeleton";

@Component({ name: "UInputNumber" })
export default class UInputNumber extends Skeleton {}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
