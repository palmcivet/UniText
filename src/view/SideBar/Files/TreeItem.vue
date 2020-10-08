<template>
  <li>
    <div
      v-if="payload.isFile"
      class="file"
      :class="payload.path === activeItem ? 'active' : ''"
      @click.stop="handleOpenFile(payload.path)"
      @contextmenu="handleContextFile()"
    >
      <div
        v-for="i in payload.tier"
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

    <div
      v-else
      class="folder"
      :class="payload.path === activeItem ? 'active' : ''"
      @contextmenu="handleContextFolder()"
      @click="TOGGLE_FOLDER(index)"
    >
      <div
        v-for="i in payload.tier"
        class="indent"
        :class="isIndent ? 'indent-show' : ''"
        :key="i"
      />
      <i :class="payload.isFold ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'" />
      <i :class="!payload.isFold ? 'ri-folder-open-line' : 'ri-folder-2-line'" />
      <pre class="space" />
      {{ title }}
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { remote } from "electron";

import {
  ICacheTree,
  ICacheTreeItem,
  ILogicTree,
  ILogicTreeItem,
  ISideBarState,
} from "@/interface/vuex/modules/sideBar";
import { TContext } from "@/app/main/menu/context";
import { BUS_FILE } from "@/common/bus-channel";
import { hasKeys } from "@/common/utils";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "TreeItem",
})
export default class TreeItem extends Vue {
  @general.State("context")
  context!: TContext;

  @sideBar.State((state: ISideBarState) => state.activeItem)
  activeItem!: string;

  @sideBar.Mutation("TOGGLE_FOLDER")
  TOGGLE_FOLDER!: (idx: number) => void;

  @Prop({
    type: Boolean,
    default: true,
  })
  suffix!: boolean;

  @Prop({
    type: Number,
    default: true,
  })
  index!: number;

  @Prop({
    type: Object,
    required: true,
  })
  payload!: ILogicTreeItem;

  @Prop({
    type: Boolean,
    default: true,
  })
  isIndent!: boolean;

  get title() {
    const addr = this.payload.path.lastIndexOf("/");
    if (addr === -1) {
      return this.payload.path;
    } else {
      return this.payload.path.slice(addr + 1);
    }
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

  handleOpenFile(value: string) {
    this.$bus.$emit(BUS_FILE.OPEN_FILE, value);
  }

  handleContextFile() {
    this.context.file.popup({
      window: remote.getCurrentWindow(),
    });
  }

  handleContextFolder() {
    this.context.folder.popup({
      window: remote.getCurrentWindow(),
    });
  }
}
</script>

<style lang="less" scoped>
* {
  -webkit-user-select: none;
}

@line-height: 1.3rem;

li {
  // background-color: #f3eddb; // DEV
  cursor: pointer;
}

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
  width: 100%;
  display: flex;
  height: @line-height;
  line-height: @line-height;

  /deep/ i,
  i {
    line-height: @line-height;
  }
}

.indent {
  width: 0.5em;
  margin-right: 0.2em;
  border-right: 0.1px solid rgba(255, 255, 255, 0);
}

.indent-show {
  border-right: 0.1px solid rgba(200, 200, 200, 0.6);
}

.file:hover,
.folder:hover {
  background-color: #e8e7e1;
}

.active {
  background-color: #e2e1da;
}
</style>
