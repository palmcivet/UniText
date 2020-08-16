<template>
  <li title="侧栏" @click="TOGGLE_PANEL()"><i class="ri-side-bar-line"></i></li>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";

@Component({
  name: "Panel",
})
export default class Panel extends Vue {
  @Mutation("general/TOGGLE_PANEL")
  TOGGLE_PANEL!: () => void;
}
</script>

<style lang="less" scoped>
li {
  transform: rotate(180deg);
}
</style>
