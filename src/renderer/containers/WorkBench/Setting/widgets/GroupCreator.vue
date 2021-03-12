<template>
  <GroupBase :label="properties.title">
    <div v-for="(v, k, i) of properties.properties" :key="i">
      <ItemTitle :field="field" :subField="k" />
      <component
        :is="v.type"
        :prop="v"
        :value="getVal(field, k)"
        @change="$emit('submit', [field, k, $event])"
      />
    </div>
  </GroupBase>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Range from "@/renderer/components/Form/UInputNumber.vue";
import TextBox from "@/renderer/components/Form/UInputText.vue";
import CheckBox from "@/renderer/components/Form/UCheckBox.vue";
import GroupBase from "@/renderer/containers/WorkBench/Setting/widgets/GroupBase.vue";
import DropDown from "./DropDown.vue";
import TextGroup from "./TextGroup.vue";
import ItemTitle from "./ItemTitle.vue";

@Component({
  name: "GroupCreator",
  components: {
    Range,
    TextBox,
    CheckBox,
    DropDown,
    TextGroup,
    ItemTitle,
    GroupBase,
  },
})
export default class GroupCreator extends Vue {
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
