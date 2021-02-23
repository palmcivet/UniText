<template>
  <option><slot /></option>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "USelectOption" })
export default class USelectOption extends Vue {}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
