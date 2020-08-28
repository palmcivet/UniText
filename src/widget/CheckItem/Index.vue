<template>
  <li :title="item.title" @click.stop="$emit('click')">
    <i :class="item.icon"></i>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface IItemGroup {
  [index: string]: {
    title: string;
    icon: string;
  };
}

@Component({
  name: "CheckItem",
})
export default class CheckItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  itemGroup!: IItemGroup;

  @Prop({
    type: String,
    required: true,
  })
  condition!: string;

  get item() {
    return this.itemGroup[this.condition];
  }
}
</script>

<style lang="less" scoped></style>
