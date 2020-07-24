<template>
  <div @dblclick.stop="newFile()">
    <span>双击新建文件</span>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Blank extends Vue {
  newFile() {
    this.$emit("newFile");
  }
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
