<template>
  <div class="option" :title="$g(prop.description)" @click.stop="onChange()">
    <input
      type="checkbox"
      :checked="currentValue"
      :disabled="disabled"
      @change="onChange()"
    />
    <label>{{ $g(prop.title) }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Skeleton from "./skeleton";

export default defineComponent({
  name: "UCheckBox",
  mixins: [Skeleton],
  methods: {
    onChange() {
      this.$emit("change", !this.currentValue);
    },
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.option {
  flex-direction: row;
  align-items: center;

  &,
  * {
    cursor: pointer;
  }

  label {
    margin-left: 3px;
  }
}
</style>
