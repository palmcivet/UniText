<template>
  <div class="option" :title="$g(prop.description)">
    <label>
      <input
        type="checkbox"
        v-model="currentValue"
        :disabled="disabled"
        @change.stop="onChange()"
      />
      {{ $g(prop.title) }}
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Skeleton from "./skeleton";

export default defineComponent({
  name: "CheckBox",
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

.option {
  input,
  label {
    cursor: pointer;
  }

  label {
    display: flex;
    flex-direction: row;
    width: 100%;
    line-height: 24px;
  }

  input {
    margin: 0;
    margin-right: 5px;
  }
}
</style>
