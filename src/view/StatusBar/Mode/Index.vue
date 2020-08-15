<template>
  <ol>
    <li :class="viewMode === 'SOURCE' ? 'active' : ''" @click="handleClick('SOURCE')">
      <i class="ri-code-s-slash-fill"></i>
    </li>
    <li :class="viewMode === 'CONTRAST' ? 'active' : ''" @click="handleClick('CONTRAST')">
      <i class="ri-layout-column-fill"></i>
    </li>
    <li :class="viewMode === 'WYSIWYG' ? 'active' : ''" @click="handleClick('WYSIWYG')">
      <i class="ri-text"></i>
    </li>
  </ol>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import { EViewMode, IGeneralState } from "@/interface/vuex/general";

const general = namespace("general");

@Component({
  name: "Mode",
})
export default class Mode extends Vue {
  @general.State((state: IGeneralState) => state.appearance.viewMode)
  viewMode!: EViewMode;

  @general.Mutation("SET_VIEW_MODE")
  SET_VIEW_MODE!: (value: EViewMode) => void;

  handleClick(value: EViewMode) {
    this.SET_VIEW_MODE(value);
  }
}
</script>

<style lang="less" scoped>
li.active {
  background-color: rgb(207, 231, 174); // DEV
}
</style>
