<template>
  <div></div>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";

@Component({
  name: "Settings",
})
export default class Settings extends Vue {}
</script>

<style lang="less" scoped></style>
