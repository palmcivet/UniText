<template>
  <li :title="item.title" @click.stop="$emit('click')">
    <i :class="item.icon" />
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

interface IItemGroup {
  [index: string]: {
    title: string;
    icon: string;
  };
}

interface IProps {
  itemGroup: IItemGroup;
  condition: string;
}

export default defineComponent<IProps, IProps>({
  name: "CheckItem",

  props: {
    itemGroup: {
      type: Object,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const item = computed(() => {
      return this.itemGroup[this.condition];
    });

    return {
      item,
    };
  },
});
</script>

<style lang="less" scoped></style>
