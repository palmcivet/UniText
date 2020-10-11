<template>
  <ol>
    <li
      v-for="(v, k, i) in listGroup"
      :key="i"
      :title="v.title"
      :style="k === condition ? activeStyle : ''"
      @click.stop="$emit('click', k)"
    >
      <i :class="v.icon" />
    </li>
  </ol>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

interface IListGroup {
  [index: string]: {
    title: string;
    icon: string;
  };
}

@Component({ name: "CheckList" })
export default class CheckList extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  listGroup!: IListGroup;

  @Prop({
    type: String,
    required: true,
  })
  condition!: string;

  @Prop({
    type: Object,
    default: () => ({
      backgroundColor: "#d7e8a1",
    }),
  })
  activeStyle!: object;
}
</script>

<style lang="less" scoped></style>
