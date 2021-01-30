<template>
  <div>
    <label />
    <input type="checkbox" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "Boolean" })
export default class Boolean extends Vue {}
</script>

<style lang="less" scoped></style>
