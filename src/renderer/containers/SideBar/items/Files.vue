<template>
  <BaseView :isBlank="isEmptyFolder">
    <template slot="blank-title">{{ $t("sidebar.files_empty") }}</template>

    <template slot="blank">
      <button @click="OPEN_PROJECT()" class="unitext-button">
        {{ $t("sidebar.files_button") }}
      </button>
    </template>

    <template slot="view-title">
      <span>{{ $t("sidebar.files_title") }}</span>
      <i
        class="ri-checkbox-indeterminate-line"
        :title="$t('sidebar.files_toggle')"
        @click="handleToggleAll()"
      />
    </template>

    <template slot="view">
      <button v-show="isEmptyFolder" @click="OPEN_PROJECT()" class="unitext-button">
        {{ $t("sidebar.files_button") }}
      </button>
      <div v-show="!isEmptyFolder" ref="root" style="height: 100%" />
    </template>
  </BaseView>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ipcRenderer } from "electron";

import BaseView from "../widgets/BaseView.vue";
import { TreeViewModel } from "@/renderer/components/Tree/treeViewModel";
import { IPC_MENUMANAGER } from "@/common/channel/ipc";
import { EMenuContextKey } from "@/typings/main";
import { IGeneralState } from "@/typings/vuex/general";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "Files",
  components: {
    BaseView,
  },
})
export default class Files extends Vue {
  tree!: TreeViewModel;

  @general.State((state: IGeneralState) => state.fileManager.showIndent)
  showIndent!: boolean;

  @general.State((state: IGeneralState) => state.fileManager.folderDir)
  folderDir!: string;

  @sideBar.Getter("isEmptyFolder")
  isEmptyFolder!: boolean;

  @sideBar.Mutation("CHOOSE_ITEM")
  CHOOSE_ITEM!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_ALL")
  TOGGLE_ALL!: (isOnce: boolean) => void;

  @sideBar.Action("OPEN_PROJECT")
  OPEN_PROJECT!: () => void;

  isIndent = false;

  isOnce = true;

  handleToggleAll() {
    this.TOGGLE_ALL(this.isOnce);
    this.CHOOSE_ITEM("");
    this.isOnce = !this.isOnce;
  }

  mounted() {
    const { dispatch } = this.$store;
    if (this.folderDir === "") return;

    dispatch("sideBar/BUILD_TREE");

    this.$nextTick(() => {
      this.tree = new TreeViewModel(this.$refs.root as HTMLElement, {
        indent: true,
        onOpen: () => {},
        onMove: () => {},
        onDelete: () => {},
        onContext: (val: string) => {
          this.CHOOSE_ITEM(val);
          ipcRenderer.send(
            IPC_MENUMANAGER.POPUP_CONTEXT,
            EMenuContextKey.SIDEBAR_FOLDER,
            val
          );
        },
      });
      (window as any).tree = this.tree;
    });
  }
}
</script>

<style lang="less" scoped>
/deep/ .view {
  button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    padding: 0.5em;
  }
}
</style>
