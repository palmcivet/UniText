<template>
  <li>
    <div v-if="isFile" class="file" @click.stop="openFile(itemData.path)">
      <div
        v-for="i in treeDeepth - 1"
        class="indent"
        :class="showIndent ? 'indent-show' : ''"
        :key="i"
      />
      <pre class="icon" />
      <pre class="space" />
      <a-icon type="file" />
      <pre class="space" />
      {{ itemData.name | trimSuffix }}
    </div>

    <div v-else class="directory">
      <div class="folder" @click.stop="toggleFolder()">
        <div
          class="indent"
          v-for="i in treeDeepth - 1"
          :class="showIndent ? 'indent-show' : ''"
          :key="i"
        />
        <i
          :class="
            notCollapse && isOpen ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'
          "
        />
        <pre class="space" />
        <a-icon v-if="notCollapse && isOpen" type="folder-open" />
        <a-icon v-else type="folder" />
        <pre class="space" />
        {{ itemData.name }}
      </div>

      <ul v-show="notCollapse && isOpen">
        <tree-item
          v-for="(subChild, subIndex) in itemData.file"
          :key="subIndex"
          :itemData="subChild"
          :treeDeepth="treeDeepth + 1"
          :showIndent="showIndent"
        />
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ITreeItem } from "@/interface/sideBar";
import { BUS_FILE } from "@/common/busChannel";

@Component({
  name: "TreeItem",
  filters: {
    trimSuffix: (value: string) => {
      const index = value.indexOf(".md");
      if (index !== -1) {
        return value.substring(0, index);
      } else {
        return value;
      }
    },
  },
})
export default class TreeItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  itemData!: ITreeItem;

  @Prop({
    type: Boolean,
    default: true,
  })
  notCollapse!: boolean;

  @Prop({
    type: Number,
    default: 1,
  })
  treeDeepth!: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  showIndent!: boolean;

  @Watch("notCollapse")
  collapse(value: boolean) {
    if (!value) this.isOpen = false;
  }

  isOpen = false;

  isHover = false;

  get isFile() {
    return this.itemData.file === undefined;
  }

  toggleFolder() {
    this.isOpen = !this.isOpen;
  }

  openFile(value: string) {
    this.$bus.$emit(BUS_FILE.OPEN_FILE, value);
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
}

.indent-show {
  border-right: 0.3px solid rgba(126, 126, 126, 0.9);
  transition: all 0.2s ease-in-out;
}

.file:hover,
.folder:hover {
  background-color: #ecdeb4;
}
</style>
