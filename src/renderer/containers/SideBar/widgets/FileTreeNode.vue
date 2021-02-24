<template>
  <div
    v-if="node.children === false"
    class="file"
    :class="isActive ? 'active' : ''"
    @click="handleOpenFile(route)"
    @contextmenu="handleFileContext(route)"
    @keydown.enter="handleRename(route)"
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

    <div v-show="isEdit" class="title">
      <input
        ref="input"
        v-model="newTitle"
        @click.stop="noop()"
        @keydown="handleSubmit($event)"
      />
    </div>
    <div v-show="!isEdit" class="title">
      {{ trimSuffix(title) }}
    </div>
  </div>

  <details v-else :open="!node.collapse">
    <summary
      class="folder"
      :class="isActive ? 'active' : ''"
      @click.prevent="handleToggleFolder(route)"
      @contextmenu="handleFolderContext(route)"
      @keydown.enter="handleRename(route)"
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

      <div v-show="isEdit" class="title">
        <input
          ref="input"
          id="input"
          v-model="newTitle"
          @click.stop="noop()"
          @keydown="handleSubmit($event)"
        />
      </div>
      <div v-show="!isEdit" class="title">
        {{ title }}
      </div>
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

import { BUS_SIDEBAR } from "@/common/channel/bus";
import { IPC_FILE, IPC_MENUMANAGER } from "@/common/channel/ipc";
import { ISideBarState, ITree, TFileRoute } from "@/typings/vuex/sideBar";
import { EMenuContextKey } from "@/typings/main";

const sideBar = namespace("sideBar");
const workBench = namespace("workBench");

@Component({
  name: "FileTreeNode",
})
export default class FileTreeNode extends Vue {
  @sideBar.State((state: ISideBarState) => state.activeItem)
  activeItem!: string;

  @sideBar.Mutation("CHOOSE_ITEM")
  CHOOSE_ITEM!: (path: string) => void;

  @sideBar.Mutation("TOGGLE_FOLDER")
  TOGGLE_FOLDER!: (route: TFileRoute) => void;

  @workBench.Mutation("NEW_FILE")
  NEW_FILE!: (title?: TFileRoute) => void;

  @workBench.Action("RENAME")
  RENAME!: (title: string) => void;

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

  isEdit = false;

  newTitle = "";

  get title() {
    return this.route[this.route.length - 1];
  }

  get path() {
    return this.route.join("/");
  }

  get isActive() {
    return this.path === this.activeItem;
  }

  noop() {}

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

  handleSubmit(e: KeyboardEvent) {
    e.stopPropagation();

    switch (e.key) {
      case "Escape":
        this.isEdit = false;
        break;
      case "Enter":
        this.isEdit = false;
        if (this.newTitle.search(/[/|\\]/) !== -1) {
          // NOTE 完善报错信息
          return;
        } else {
          this.RENAME(this.newTitle.trim());
        }
        break;
      case "Space":
        break;
    }
  }

  handleRename() {
    if (!this.isActive) return;
    this.newTitle = this.title;
    this.isEdit = true;
    this.$nextTick(() => {
      (this.$refs.input as HTMLElement).focus();
    });
  }

  handleNewFile() {
    // 在此校验名称，最终发送 route 到 vuex
    this.NEW_FILE();
  }

  handleOpenFile(value: TFileRoute) {
    ipcRenderer.emit(IPC_FILE.OPEN, null, value);
  }

  handleFileContext(value: TFileRoute) {
    this.CHOOSE_ITEM(this.path);
    ipcRenderer.send(IPC_MENUMANAGER.POPUP_CONTEXT, EMenuContextKey.SIDEBAR_FILE, value);
  }

  handleFolderContext(value: TFileRoute) {
    this.CHOOSE_ITEM(this.path);
    ipcRenderer.send(
      IPC_MENUMANAGER.POPUP_CONTEXT,
      EMenuContextKey.SIDEBAR_FOLDER,
      value
    );
  }

  created() {
    this.$bus.on(BUS_SIDEBAR.RENAME, this.handleRename);
  }

  beforeDestroy() {
    this.$bus.off(BUS_SIDEBAR.RENAME, this.handleRename);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.file,
.folder {
  display: flex;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: @sideBar-item-height;

  * {
    user-select: none;
    height: @sideBar-item-height;
    line-height: @sideBar-item-height;
  }

  .indent {
    width: 0.5em;
    margin-right: 0.2em;
    border-right: 0.1px solid transparent;
  }

  .indent-show {
    border-right: 0.1px solid var(--sideBarIndent-activeFg);
  }

  i {
    font-size: 1rem;
  }

  pre {
    display: inline-block;
    margin: 0;

    &.icon {
      width: 1em;
    }

    &.space {
      width: 0.2em;
    }
  }

  .title {
    width: 100%;

    input {
      width: 100%;
      outline: none;
      padding: 1px 0;
      border-width: 0.5px 0;
      border-style: solid;
      border-color: white;
      background-color: #faf9f4;
    }
  }
}

.file:hover,
.folder:hover {
  background: var(--sideBarItem-selectFg);
}

details > summary::-webkit-details-marker {
  display: none;
}

.active {
  color: var(--sideBarItem-hoverFg);
  background: var(--sideBarItem-hoverBg);
}
</style>
