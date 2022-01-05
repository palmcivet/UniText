<template>
  <select class="form-select" v-model="currentValue" @change.stop="onChange()">
    <option
      class="form-select__option"
      v-for="(option, index) in options"
      :key="index"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

interface IFormSelectOption<T> {
  label: string;
  value: T;
}

export default defineComponent({
  name: "FormSelect",

  props: {
    value: {
      type: [Object, String, Boolean, Number] as PropType<any>,
    },
    options: {
      type: Array as PropType<Array<IFormSelectOption<any>>>,
      default: [],
    },
  },

  setup(props, { emit }) {
    const currentValue = ref(props.value);

    watch(
      () => props.value,
      (newValue) => {
        currentValue.value = newValue;
      }
    );

    const onChange = () => {
      emit("form-change", currentValue.value);
    };

    return {
      currentValue,

      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.form-select {
  cursor: pointer;
}
</style>
