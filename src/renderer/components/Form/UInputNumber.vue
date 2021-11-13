<template>
  <div class="option" :title="$g(prop.description)">
    <label>{{ $g(prop.title) }}</label>
    <input
      type="number"
      v-model.number="currentValue"
      :max="prop.maximum"
      :min="prop.minimum"
      :disabled="disabled"
      @change="onChange()"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Skeleton from "./skeleton";

export default defineComponent({
  name: "UInputNumber",
  mixins: [Skeleton],
  methods: {
    onChange() {
      this.$emit("change", this.currentValue);
    },
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
