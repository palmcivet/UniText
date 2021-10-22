<template>
  <div class="tabs-with-panel">
    <div class="drag-hotspot">
      <div class="hotspot__left"></div>
      <div class="hotspot__center"></div>
      <div class="hotspot__right"></div>
    </div>

    <div>
      <div>操作层</div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Draggable from "vuedraggable";

import CloseIcon from "./CloseIcon.vue";

export default defineComponent({
  name: "Workbench",

  components: {},

  data() {
    return {};
  },

  methods: {},

  created() {},

  beforeDestroy() {},
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.tabs-with-panel {
  display: flex;
  width: 100%;
}
</style>
