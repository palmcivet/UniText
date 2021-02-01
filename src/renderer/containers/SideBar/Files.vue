<template>
  <!-- 更改上层 Component 组件后，删除 div -->
  <div>
    <BaseView :isBlank="isEmptyFolder">
      <template slot="blank-title">{{ $t("sidebar.files_empty") }}</template>

      <template slot="blank">
        <button @click="OPEN_PROJECT()">{{ $t("sidebar.files_button") }}</button>
      </template>

      <template slot="view-title">
        <span>{{ $t("sidebar.files_title") }}</span>
        <i
          class="ri-checkbox-indeterminate-line"
          :title="$t('sidebar.files_toggle')"
          @click="handleToggleAll()"
        />
      </template>

      <template
        slot="view"
        @mouseenter="handleMouseEnter()"
        @mouseleave="handleMouseLeave()"
      >
        <ul>
          <FileTreeNode
            v-for="(data, name) in fileTree"
            :key="data.order"
            :tier="0"
            :node="data"
            :route="[name]"
            :isIndent="isIndent"
          />
        </ul>
      </template>
    </BaseView>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Draggable from "vuedraggable";

import BaseView from "./BaseView.vue";
import FileTreeNode from "./FileTreeNode.vue";
import { ISideBarState, ITree } from "@/typings/vuex/sideBar";
import { IGeneralState } from "@/typings/vuex/general";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "Files",
  components: {
    FileTreeNode,
    Draggable,
    BaseView,
  },
})
export default class Files extends Vue {
  @general.State((state: IGeneralState) => state.fileManager.showIndent)
  showIndent!: boolean;

  @sideBar.State((state: ISideBarState) => state.fileTree)
  fileTree!: ITree;

  @sideBar.Getter("isEmptyFolder")
  isEmptyFolder!: boolean;

  @sideBar.Mutation("CHOOSE_ITEM")
  CHOOSE_ITEM!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_ALL")
  TOGGLE_ALL!: (isOnce: boolean) => void;

  @sideBar.Action("LOAD_TREE")
  LOAD_TREE!: () => void;

  @sideBar.Action("OPEN_PROJECT")
  OPEN_PROJECT!: () => void;

  isIndent = false;

  isOnce = true;

  handleToggleAll() {
    this.TOGGLE_ALL(this.isOnce);
    this.CHOOSE_ITEM("");
    this.isOnce = !this.isOnce;
  }

  handleMouseEnter() {
    this.showIndent && (this.isIndent = true);
  }
  handleMouseLeave() {
    this.showIndent && (this.isIndent = false);
  }

  mounted() {
    this.LOAD_TREE();
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

/deep/ .view {
  button {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, 50%);
    padding: 0.5em;

    #button-style();
  }
}
</style>
