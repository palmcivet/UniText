<template>
  <keep-alive>
    <component v-show="isShowSide" :is="activity" />
  </keep-alive>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import Tags from "@/renderer/containers/SideBar/Tags.vue";
import Files from "@/renderer/containers/SideBar/Files.vue";
import Search from "@/renderer/containers/SideBar/Search.vue";
import Bookmarks from "@/renderer/containers/SideBar/Bookmarks.vue";
import Settings from "@/renderer/containers/SideBar/Settings.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { EActivityType, ISideBarState } from "@/typings/vuex/sideBar";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "SideBar",
  components: {
    Tags,
    Files,
    Search,
    Settings,
    Bookmarks,
  },
})
export default class SideBar extends Vue {
  @sideBar.State((state: ISideBarState) => state.activity)
  activity!: EActivityType.FILES;

  @general.State((state: IGeneralState) => state.userInterface.showSideBar)
  isShowSide!: boolean;
}
</script>

<style lang="less" scoped></style>
