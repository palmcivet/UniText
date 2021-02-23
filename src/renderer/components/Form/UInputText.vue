<template>
  <div class="option" :title="$g(prop.description)">
    <label>{{ $g(prop.title) }}</label>
    <input type="text" v-model="res" :disabled="hasDisabled" @change="handleChange()" />
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import Skeleton from "./skeleton";

@Component({ name: "UInputText" })
export default class UInputText extends Skeleton {}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
