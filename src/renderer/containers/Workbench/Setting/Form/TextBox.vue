<template>
  <div class="option" :title="$g(prop.description)">
    <label>{{ $g(prop.title) }}</label>
    <input
      type="text"
      v-model="currentValue"
      :disabled="disabled"
      spellcheck="false"
      @change="onChange()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Skeleton from "./skeleton";

export default defineComponent({
  name: "TextBox",
  mixins: [Skeleton],
  methods: {
    onChange() {
      this.$emit("u-change", this.currentValue);
    },
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
