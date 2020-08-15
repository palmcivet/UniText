<template>
  <li title="侧栏"><i class="ri-side-bar-line"></i></li>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Panel",
})
export default class Panel extends Vue {}
</script>

<style lang="less" scoped>
li {
  transform: rotate(180deg);
}
</style>
