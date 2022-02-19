<template>
  <div class="startup" @dblclick.stop="onCreate()">
    <span class="startup-tips">{{ $t("view.workbench.startup.tips") }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  user-select: none;

  &-tips {
    font-size: 1.8em;
    font-weight: bolder;
    width: 200px;
    text-align: center;
    color: var(--u-browser-title-fg);
  }
}
</style>
