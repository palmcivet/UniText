<template>
  <div class="panel">
    <Toc />
    <Info />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Toc from "./Toc/Index.vue";
import Info from "./Info/Index.vue";

export default defineComponent({
  name: "Panel",

  components: {
    Toc,
    Info,
  },

  setup() {},
});
</script>

<style lang="less" scoped>
.panel {
  height: 100%;
  overflow-y: auto;
}
</style>
