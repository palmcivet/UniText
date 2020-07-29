<template>
  <div>
    Marks
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Vue, Component } from "vue-property-decorator";

@Component({ name: "Marks" })
export default class Marks extends Vue {}
</script>

<style lang="less" scoped></style>
