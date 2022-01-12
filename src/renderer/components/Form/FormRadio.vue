<template>
  <label
    class="form-radio"
    v-for="(option, index) in options"
    :key="index"
    @change.stop="onChange()"
  >
    <input
      class="form-radio__radio"
      type="radio"
      :value="option.value"
      v-model="currentValue"
    />
    <span class="form-radio__label">{{ option.label }}</span>
  </label>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";

interface IFormRadioOption<T> {
  label: string;
  value: T;
}

export default defineComponent({
  name: "FormRadio",

  emits: ["form-change"],

  props: {
    value: {
      type: [String, Boolean, Number] as PropType<any>,
      default: "",
    },
    options: {
      type: Array as PropType<Array<IFormRadioOption<any>>>,
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

.form-radio {
  cursor: pointer;

  &__radio {
    cursor: pointer;
    vertical-align: bottom;
  }

  &__label {
    line-height: @line-height;
  }
}
</style>
