<template>
  <div class="form-textarea">
    <textarea
      class="form-textarea__textarea"
      v-bind="$attrs"
      v-model="currentValue"
      @change.stop="onChange()"
    />
    <i
      class="form-textarea__clear ri-close-line"
      v-if="canClear"
      @click.stop="onClear()"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "FormTextarea",

  inheritAttrs: false,

  emits: ["form-change"],

  props: {
    value: {
      type: String,
      default: "",
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

    const canClear = computed(() => props.clearable && currentValue.value?.length !== 0);
    const onClear = () => {
      currentValue.value = "";
      onChange();
    };

    return {
      currentValue,
      canClear,

      onClear,
      onChange,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.form-textarea {
  display: flex;
  align-items: center;
  position: relative;

  &__textarea {
    margin: 0;
    width: 100%;
    color: var(--u-form-fg);
    background-color: var(--u-form-bg);
    border-radius: var(--u-border-radius);
    border: 1px solid var(--u-form-outline-bg);
  }

  &__clear {
    @align-offset: 1px;
    @position-offset: 3px;

    cursor: pointer;
    position: absolute;
    border-radius: 50%;
    right: @position-offset;
    bottom: @position-offset;
    font-size: @icon-size;
    padding-left: @align-offset;
    padding-top: @align-offset;
    width: @icon-size - @align-offset;
    height: @icon-size - @align-offset;
  }
}
</style>
