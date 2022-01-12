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
      type: [String, Object, Boolean, Number],
    },
    clearable: {
      type: Boolean,
      default: true,
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

    const canClear = computed(() => {
      return (
        !["password", "number", "checkbox"].includes(props.type) &&
        props.clearable &&
        currentValue.value?.toString().length !== 0
      );
    });
    const onClear = () => {
      currentValue.value = "";
      onChange();
    };

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

.form-input {
  position: relative;

  &__input {
    box-sizing: border-box;

    &[type="checkbox"] {
      cursor: pointer;
    }

    &[type="number"] {
      width: 100%;
    }

    &[type="text"] {
      width: 100%;
      background: var(--inputBox-Bg);
    }
  }

  &__clear {
    cursor: pointer;
    position: absolute;
    right: 0;
    border-radius: 50%;
    font-size: @icon-size;
    line-height: @line-height;
  }
}
</style>
