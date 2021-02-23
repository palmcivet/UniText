<template>
  <div class="option" :title="$g(prop.description)">
    <label>{{ $g(prop.title) }}</label>
    <select v-model="res" @change="handleChange()">
      <slot />
    </select>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import Skeleton from "./skeleton";

@Component({ name: "USelect" })
export default class USelect extends Skeleton {}
</script>

<style lang="less" scoped>
@import "./style.less";

select {
  cursor: pointer;
  max-width: calc(@input-width / 2);
}
</style>
