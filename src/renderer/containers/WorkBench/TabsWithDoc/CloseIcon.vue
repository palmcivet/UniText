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
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "CloseIcon" })
export default class CloseIcon extends Vue {
  @Prop({ type: Boolean, required: true })
  needSave!: boolean;

  isHover = false;
}
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
    background: var(--tabBar-hoverBg);
  }
}
</style>
