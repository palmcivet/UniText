<template>
  <ol>
    <li
      :class="appearance.typingMode === 'source' ? 'active' : ''"
      @click="handleClick('source')"
    >
      <i class="ri-code-s-slash-fill"></i>
    </li>
    <li
      :class="appearance.typingMode === 'contrast' ? 'active' : ''"
      @click="handleClick('contrast')"
    >
      <i class="ri-layout-column-fill"></i>
    </li>
    <li
      :class="appearance.typingMode === 'richText' ? 'active' : ''"
      @click="handleClick('richText')"
    >
      <i class="ri-text"></i>
    </li>
  </ol>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { ETypingMode } from "@/interface/vuex/general";

const general = namespace("general");

@Component({
  name: "Mode",
})
export default class Mode extends Vue {
  @general.State("appearance")
  appearance!: any;

  @general.Mutation("SET_TYPING_MODE")
  SET_TYPING_MODE!: (value: ETypingMode) => void;

  handleClick(value: ETypingMode) {
    this.SET_TYPING_MODE(value);
  }
}
</script>

<style lang="less" scoped>
li.active {
  background-color: rgb(207, 231, 174); // DEV
}
</style>
