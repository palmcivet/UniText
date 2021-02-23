<template>
  <USelect :prop="prop" :value="value" @change="$emit('change', $event)">
    <USelectOption v-for="(i, k) in prop.enum" :key="k" :value="i">
      {{ i }}
    </USelectOption>
  </USelect>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import USelect from "@/renderer/components/Form/USelect.vue";
import USelectOption from "@/renderer/components/Form/USelectOption.vue";

@Component({
  name: "DropDown",
  components: {
    USelect,
    USelectOption,
  },
})
export default class DropDown extends Vue {
  @Prop({ type: Object, required: true })
  prop!: any;

  @Prop({ type: String, default: false })
  value!: string;
}
</script>

<style lang="less" scoped></style>
