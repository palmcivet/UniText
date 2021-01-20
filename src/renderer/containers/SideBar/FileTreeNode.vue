<template>
  <div
    v-if="node.children === false"
    class="file"
    :class="path === activeItem ? 'active' : ''"
    @click="handleOpenFile(route)"
    @contextmenu="handleContextFile(route)"
  >
    <div
      v-for="i in tier"
      class="indent"
      :class="isIndent ? 'indent-show' : ''"
      :key="i"
    />
    <pre class="icon" />
    <!-- FEAT 图标 -->
    <i class="ri-markdown-line" />
    <pre class="space" />
    {{ trimSuffix(title) }}
  </div>

  <details v-else :open="!node.collapse">
    <summary
      class="folder"
      :class="path === activeItem ? 'active' : ''"
      @click.prevent="handleToggleFolder(route)"
      @contextmenu="handleContextFolder(route)"
    >
      <div
        v-for="i in tier"
        class="indent"
        :class="isIndent ? 'indent-show' : ''"
        :key="i"
      />
      <i :class="node.collapse ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'" />
      <i :class="node.collapse ? 'ri-folder-2-line' : 'ri-folder-open-line'" />
      <pre class="space" />
      {{ title }}
    </summary>

    <FileTreeNode
      v-for="(data, name) in node.children"
      :key="data.order"
      :tier="tier + 1"
      :node="data"
      :route="route.concat([name])"
      :isIndent="isIndent"
    />
  </details>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { ipcRenderer } from "electron";

import { ISideBarState, ITree, TFileRoute } from "@/typings/vuex/sideBar";
import { IPC_MENUMANAGER } from "@/common/channel";
import { EMenuContextKey } from "@/typings/bootstrap";

const sideBar = namespace("sideBar");
const workBench = namespace("workBench");

@Component({
  name: "FileTreeNode",
})
export default class FileTreeNode extends Vue {
  @sideBar.State((state: ISideBarState) => state.activeItem)
  activeItem!: string;

  @sideBar.State((state: ISideBarState) => state.filesState.folderDir)
  folderDir!: string;

  @sideBar.Mutation("CHOOSE_ITEM")
  CHOOSE_ITEM!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_FOLDER")
  TOGGLE_FOLDER!: (route: TFileRoute) => void;

  @workBench.Action("OPEN_FILE")
  OPEN_FILE!: (route: TFileRoute) => void;

  @Prop({ type: Array, required: true })
  route!: TFileRoute;

  @Prop({ type: Number, required: true })
  tier!: number;

  @Prop({ type: Boolean, default: true })
  suffix!: boolean;

  @Prop({ type: Object, required: true })
  node!: ITree;

  @Prop({ type: Boolean, default: true })
  isIndent!: boolean;

  get title() {
    return this.route[this.route.length - 1];
  }

  get path() {
    return this.route.join("/");
  }

  trimSuffix(value: string) {
    if (!this.suffix) return value;
    const index = value.indexOf(".md");
    if (index !== -1) {
      return value.substring(0, index);
    } else {
      return value;
    }
  }

  handleToggleFolder(route: TFileRoute) {
    this.TOGGLE_FOLDER(route);
    this.CHOOSE_ITEM(this.path);
  }

  handleOpenFile(value: TFileRoute) {
    this.OPEN_FILE(value);
    this.CHOOSE_ITEM(this.path);
  }

  handleContextFile(value: TFileRoute) {
    ipcRenderer.send(IPC_MENUMANAGER.POPUP_CONTEXT, EMenuContextKey.SIDEBAR_FILE, value);
  }

  handleContextFolder(value: TFileRoute) {
    ipcRenderer.send(
      IPC_MENUMANAGER.POPUP_CONTEXT,
      EMenuContextKey.SIDEBAR_FOLDER,
      value
    );
  }
}
</script>

<style lang="less" scoped>
* {
  -webkit-user-select: none;
}

@line-height: 1.3rem;

pre {
  display: inline-block;

  &.icon {
    width: 1em;
  }

  &.space {
    width: 0.2em;
  }
}

.file,
.folder {
  display: flex;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: @line-height;
  line-height: @line-height;

  i {
    line-height: @line-height;
  }
}

.file:hover,
.folder:hover {
  background-color: #e8e7e1;
}

details > summary::-webkit-details-marker {
  display: none;
}

.indent {
  width: 0.5em;
  margin-right: 0.2em;
  border-right: 0.1px solid rgba(255, 255, 255, 0);
}

.indent-show {
  border-right: 0.1px solid rgba(200, 200, 200, 0.6);
}

.active {
  background-color: #e2e1da;
}
</style>
