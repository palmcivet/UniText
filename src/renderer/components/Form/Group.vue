<template>
  <div class="group">
    <div>{{ $g(properties.title) }}</div>
    <div>
      <component
        v-for="(v, k, i) of properties.properties"
        :key="i"
        :is="v.type"
        :properties="v"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import Range from "./Range.vue";
import Boolean from "./Boolean.vue";
import DropDown from "./DropDown.vue";
import TextBox from "./TextBox.vue";
import TextGroup from "./TextGroup.vue";

@Component({
  name: "Group",
  components: {
    Range,
    Boolean,
    DropDown,
    TextBox,
    TextGroup,
  },
})
export default class Group extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;
}
</script>

<style lang="less" scoped>
.group {
  margin: 15px 0;

  > div:first-child {
    width: 100%;
    font-size: 1.5em;
    font-weight: 400;
    border-left: solid 3px #bbd457;
    padding-left: 7px;
    margin-bottom: 10px;
  }

  > div:last-child {
    margin-left: 10px;
  }
}
</style>
