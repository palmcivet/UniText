<template>
  <div>
    Search
  </div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Search extends Vue {}
</script>

<style lang="less" scoped></style>
