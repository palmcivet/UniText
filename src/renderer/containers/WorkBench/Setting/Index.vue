<template>
  <div></div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { State } from "vuex-class";

@Component({
  name: "Setting",
})
export default class Setting extends Vue {
  created() {}

  beforeDestory() {}
}
</script>

<style lang="less" scoped></style>
