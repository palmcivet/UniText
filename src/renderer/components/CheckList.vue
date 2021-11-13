<template>
  <ul>
    <li
      v-for="(v, k, i) in listGroup"
      :key="i"
      :title="v.title"
      :style="k === condition ? activeStyle : ''"
      @click.stop="$emit('click', k)"
    >
      <i :class="v.icon" />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface IListGroup {
  [index: string]: {
    title: string;
    icon: string;
  };
}

export default defineComponent({
  name: "CheckList",

  props: {
    listGroup: {
      type: Object as PropType<IListGroup>,
      required: true,
    },

    condition: {
      type: String,
      required: true,
    },

    activeStyle: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="less" scoped></style>
