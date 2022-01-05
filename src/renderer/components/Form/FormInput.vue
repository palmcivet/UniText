<template>
  <div class="form-input">
    <input
      class="form-input__input"
      :type="type"
      v-bind="$attrs"
      v-model="currentValue"
      @change.stop="onChange()"
    />
    <i class="form-input__clear ri-close-line" v-if="canClear" @click.stop="onClear()" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from "vue";

export default defineComponent({
  name: "FormInput",

  inheritAttrs: false,

  emits: ["form-change"],

  props: {
    type: {
      type: String as PropType<"text" | "password" | "number" | "email" | "checkbox">,
      default: "text",
    },
    value: {
      type: [Object, Boolean, String],
    },
    clearable: {
      type: Boolean,
      default: false,
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

    const onClear = () => {
      currentValue.value = "";
    };

    const canClear = computed(() => {
      return props.clearable && ["password", "checkbox"].includes(props.type);
    });

    return {
      currentValue,
      canClear,

      onChange,
      onClear,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
