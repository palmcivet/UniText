<template>
  <div class="group">
    <div class="title">{{ $g(properties.title) }}</div>
    <div class="items">
      <component
        v-for="(v, k, i) of properties.properties"
        :key="i"
        :is="v.type"
        :field="`${field}.${k}`"
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

  @Prop({ type: String, required: true })
  field!: string;
}
</script>

<style lang="less" scoped>
.group {
  padding: 15px 8em 15px 8em;

  > .title {
    width: 100%;
    font-size: 1.5em;
    font-weight: 400;
    border-left: solid 5px #bbd457;
    padding-left: 15px;
  }

  > .items {
    > * {
      padding: 0.5em 0 0.5em 20px;

      &:hover {
        cursor: pointer;
        background-color: rgba(230, 230, 230, 0.6);
      }
    }
  }
}
</style>
