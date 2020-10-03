<template>
  <li>
    <div
      v-if="isFile"
      class="file"
      :class="itemData.path === activeItem ? 'active' : ''"
      @click.stop="handleOpenFile(itemData.path)"
      @contextmenu="handleContextFile()"
    >
      <div
        v-for="i in treeDeepth - 1"
        class="indent"
        :class="isIndent ? 'indent-show' : ''"
        :key="i"
      />
      <pre class="icon" />
      <!-- FEAT 图标 -->
      <i class="ri-markdown-line"></i>
      <pre class="space" />
      {{ trimSuffix(itemName) }}
    </div>

    <div v-else class="directory">
      <div
        class="folder"
        :class="itemData.path === activeItem ? 'active' : ''"
        @click="handleToggle(itemData.path)"
        @contextmenu="handleContextFolder()"
      >
        <div
          class="indent"
          v-for="i in treeDeepth - 1"
          :class="isIndent ? 'indent-show' : ''"
          :key="i"
        />
        <i :class="itemData.fold ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'" />
        <i :class="!itemData.fold ? 'ri-folder-open-line' : 'ri-folder-2-line'" />
        <pre class="space" />
        {{ itemName }}
      </div>

      <ul v-show="!itemData.fold">
        <tree-item
          v-for="(subData, subName) in itemData.file"
          :key="subData.order"
          :itemName="subName"
          :itemData="subData"
          :isIndent="isIndent"
          :activeItem="activeItem"
          :treeDeepth="treeDeepth + 1"
          @toggle="handleToggle($event)"
        />
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { remote } from "electron";

import { ITreeItem, ISideBarState } from "@/interface/vuex/modules/sideBar";
import { TContext } from "@/app/main/menu/context";
import { BUS_FILE } from "@/common/bus-channel";
import { hasKeys } from "@/common/utils";

const sideBar = namespace("sideBar");
const general = namespace("general");

@Component({
  name: "TreeItem",
})
export default class TreeItem extends Vue {
  @sideBar.State((state: ISideBarState) => state.activeItem)
  activeItem!: string;

  @general.State("context")
  context!: TContext;

  @Prop({
    type: String,
    required: true,
  })
  itemName!: string;

  @Prop({
    type: Object,
    required: true,
  })
  itemData!: ITreeItem;

  @Prop({
    type: Boolean,
    default: true,
  })
  isIndent!: boolean;

  @Prop({
    type: Number,
    default: 1,
  })
  treeDeepth!: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  suffix!: boolean;

  get isFile() {
    return !hasKeys(this.itemData.file);
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

  handleToggle(value: string) {
    this.$emit("toggle", value);
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

.directory {
  width: 100%;
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
