<template>
  <i
    :class="
      isHover
        ? 'ri-close-circle-line'
        : needSave
        ? 'ri-checkbox-blank-circle-line'
        : 'ri-close-line'
    "
    @click.stop="$emit('close')"
    @mouseenter="isHover = true"
    @mouseout="isHover = false"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CloseIcon",

  props: {
    needSave: { type: Boolean, required: true },
  },

  setup() {
    return {
      isHover: false,
    };
  },
});
</script>

<style lang="less" scoped>
i {
  line-height: 12px;
  font-size: 12px;
  border-radius: 50%;
  position: absolute;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    opacity: 1;
    background: var(--tabBarTab-hoverBg);
  }
}
</style>
