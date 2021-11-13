<template>
  <div class="option" :title="$g(prop.description)">
    <label>{{ $g(prop.title) }}</label>
    <select v-model="currentValue" @change="onChange()">
      <option
        v-for="(optionValue, index) in optionList"
        :key="index"
        :value="optionValue"
      >
        {{ optionValue }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import Skeleton from "./skeleton";
import { defineComponent } from "vue";

export default defineComponent({
  name: "USelect",
  mixins: [Skeleton],
  props: {
    optionList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onChange() {
      this.$emit("change", this.currentValue);
    },
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

select {
  cursor: pointer;
  max-width: calc(@input-width / 2);
}
</style>
