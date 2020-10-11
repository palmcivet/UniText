<template>
  <div class="">
    Tags
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Tags",
})
export default class Tags extends Vue {}
</script>

<style lang="less" scoped></style>
