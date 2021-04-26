<template>
  <BaseView :isBlank="isEmptyMarks">
    <template slot="view-title">
      <span>{{ $t("sidebar.marks") }}</span>
    </template>

    <template slot="view">
      <ul>
        <li
          v-for="(v, i) in markList"
          :key="i"
          :title="`${v.time} 添加`"
          @click="handleOpenFile(v.path)"
        >
          {{ v.path[v.path.length - 1] }}
        </li>
      </ul>
    </template>
  </BaseView>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import ListNode from "../widgets/ListNode.vue";
import BaseView from "../widgets/BaseView.vue";
import { IGeneralState } from "@/typings/vuex/general";
import { IMark, ISideBarState, TFileRoute } from "@/typings/vuex/sideBar";
import { IPC_FILE } from "@/common/channel/ipc";
import { ipcRenderer } from "electron";

const sideBar = namespace("sideBar");
const general = namespace("general");
@Component({
  name: "Marks",
  components: {
    BaseView,
    ListNode,
  },
})
export default class Marks extends Vue {
  @general.State((state: IGeneralState) => state.fileManager.folderDir)
  folderDir!: string;

  @sideBar.State((state: ISideBarState) => state.markList)
  markList!: Array<IMark>;

  @sideBar.Getter("isEmptyMarks")
  isEmptyMarks!: boolean;

  @sideBar.Mutation("LOAD_MARKLIST")
  LOAD_MARKLIST!: (base: string) => void;

  handleOpenFile(value: TFileRoute) {
    ipcRenderer.emit(IPC_FILE.OPEN, null, value);
  }

  mounted() {
    this.LOAD_MARKLIST(this.folderDir);
  }
}
</script>

<style lang="less" scoped>
ul {
  padding: 2px;

  li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;

    // DEV 来自 FileTreeNode
    user-select: none;
    height: 1.5em;
    line-height: 1.5em;

    &:hover {
      color: var(--sideBarItem-hoverFg);
      background: var(--sideBarItem-hoverBg);
    }
  }
}
</style>
