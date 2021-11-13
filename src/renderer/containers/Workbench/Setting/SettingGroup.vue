<template>
  <div class="group">
    <h3 class="label">{{ $g(properties.title) }}</h3>
    <div class="items">
      <div v-for="(v, k, i) of properties.properties" :key="i">
        <div class="code">
          <span>{{ field }}</span>
          <span>.</span>
          <span>{{ k }}</span>
        </div>
        <component
          :is="v.type"
          :prop="v"
          :value="getVal(field, k)"
          @change="onChange([field, k, $event])"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Range from "@/renderer/components/Form/UInputNumber.vue";
import CheckBox from "@/renderer/components/Form/UCheckBox.vue";
import TextBox from "@/renderer/components/Form/UInputText.vue";
import TextGroup from "@/renderer/components/Form/UTextGroup.vue";
import DropDown from "@/renderer/components/Form/USelect.vue";

export default defineComponent({
  name: "GroupCreator",

  components: {
    Range,
    CheckBox,
    TextBox,
    TextGroup,
    DropDown,
  },

  props: {
    field: { type: String, required: true },
    userData: { type: Object, required: true },
    properties: { type: Object, required: true },
  },

  methods: {
    getVal(g: string, f: string) {
      return this.userData[g][f];
    },

    onChange(value: any) {
      this.$emit("submit", value);
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.group {
  padding-top: 15px;
  padding-bottom: 15px;

  /deep/ .label {
    padding-left: 15px;
    margin-bottom: 0.2em;
    font-size: 1.5em;
    border-left: solid 5px var(--formGroupTitleBorder-Color);
  }

  /deep/ .items {
    > * {
      padding: 0.3em 0 0.3em 20px;
      user-select: none;

      &:hover {
        color: var(--formGroup-hoverFg);
        background: var(--formGroup-hoverBg);
      }
    }
  }
}

.code {
  font-size: 1em;
  font-family: @code-font-family;
  display: inline-flex;
  align-items: center;

  span:last-child {
    font-size: 1.1em;
    color: var(--inputBox-Fg);
  }
}
</style>
