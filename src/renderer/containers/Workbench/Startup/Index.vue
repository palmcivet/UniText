<template>
  <div class="startup" @dblclick.stop="onCreate()">
    <span class="startup-tips">双击新建文件</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  name: "Startup",

  inject: ["$workbench"],

  components: {},

  methods: {
    onCreate() {
      this.$workbench.doCreateMarkdown();
    },
  },
});
</script>

<style lang="less" scoped>
.startup {
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: space-around;
  user-select: none;

  &-tips {
    font-size: 1.8em;
    width: 200px;
    text-align: center;
  }
}
</style>
