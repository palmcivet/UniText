<template>
  <UFormGroup :label="properties.title">
    <div v-for="(v, k, i) of properties.properties" :key="i">
      <GroupHead :field="field" :subField="k" />
      <component
        :is="v.type"
        :prop="v"
        :value="getVal(field, k)"
        @change="$emit('submit', [field, k, $event])"
      />
    </div>
  </UFormGroup>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Range from "@/renderer/components/Form/UInputNumber.vue";
import TextBox from "@/renderer/components/Form/UInputText.vue";
import CheckBox from "@/renderer/components/Form/UCheckBox.vue";
import UFormGroup from "@/renderer/components/Form/UFormGroup.vue";
import DropDown from "./DropDown.vue";
import TextGroup from "./TextGroup.vue";
import GroupHead from "./GroupHead.vue";

@Component({
  name: "Group",
  components: {
    Range,
    TextBox,
    CheckBox,
    DropDown,
    TextGroup,
    GroupHead,
    UFormGroup,
  },
})
export default class Group extends Vue {
  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: Object, required: true })
  userData!: any;

  @Prop({ type: Object, required: true })
  properties!: any;

  getVal(g: string, f: string) {
    return this.userData[g][f];
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
