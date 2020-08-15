<template>
  <ol>
    <li>iCloud</li>
    <li><i class="ri-cloud-off-line"></i></li>
    <!-- <li><i class="ri-cloud-line"></i></li> -->
  </ol>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Sync",
  components: {},
})
export default class Sync extends Vue {}
</script>

<style lang="less" scoped></style>
