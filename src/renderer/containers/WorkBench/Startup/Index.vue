<template>
  <div @dblclick.stop="NEW_FILE()">
    <span>双击新建文件</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

const workBench = namespace("workBench");

@Component({
  name: "Startup",
})
export default class Startup extends Vue {
  @workBench.Action("NEW_FILE")
  NEW_FILE!: (title?: string) => void;
}
</script>

<style lang="less" scoped>
div {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-around;
  -webkit-user-select: none;

  & > span {
    font-size: 1.8em;
    width: 200px;
    text-align: center;
  }
}
</style>
