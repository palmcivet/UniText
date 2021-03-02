<template>
  <keep-alive>
    <component v-show="isShowSide" :is="activity" />
  </keep-alive>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import Tags from "@/renderer/containers/SideBar/items/Tags.vue";
import Files from "@/renderer/containers/SideBar/items/Files.vue";
import Search from "@/renderer/containers/SideBar/items/Search.vue";
import Marks from "@/renderer/containers/SideBar/items/Marks.vue";
import Settings from "@/renderer/containers/SideBar/items/Settings.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { EActivityType, ISideBarState } from "@/typings/vuex/sideBar";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "SideBar",
  components: {
    Tags,
    Files,
    Marks,
    Search,
    Settings,
  },
})
export default class SideBar extends Vue {
  @sideBar.State((state: ISideBarState) => state.activity)
  activity!: EActivityType.FILES;

  @general.State((state: IGeneralState) => state.interface.showSideBar)
  isShowSide!: boolean;
}
</script>

<style lang="less" scoped></style>
