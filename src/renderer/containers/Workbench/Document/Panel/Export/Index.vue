<template>
  <div class="panel-export">
    <div class="unitext-button" @click="onExport()">导出</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Export",

  setup() {
    const onExport = () => {};

    return {
      onExport,
    };
  },
});
</script>

<style lang="less" scoped>
.panel-export {
  @cell-gap: 5px;

  height: 100%;
  overflow-y: auto;
  padding: 0 @cell-gap;
}
</style>
