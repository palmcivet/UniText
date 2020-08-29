<template>
  <li>
    <div v-if="isFile" class="file" @click.stop="openFile(itemData.path)">
      <div
        v-for="i in treeDeepth - 1"
        class="indent"
        :class="isIndent ? 'indent-show' : ''"
        :key="i"
      />
      <pre class="icon" />
      <pre class="space" />
      <!-- FEAT -->
      <i class="ri-markdown-line"></i>
      <pre class="space" />
      {{ `${suffix ? trimSuffix(itemName) : itemName}` }}
    </div>

    <div v-else class="directory">
      <div class="folder" @click="$emit('toggle', itemData.path)">
        <div
          class="indent"
          v-for="i in treeDeepth - 1"
          :class="isIndent ? 'indent-show' : ''"
          :key="i"
        />
        <i :class="itemData.fold ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'" />
        <pre class="space" />
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
          :treeDeepth="treeDeepth + 1"
          @toggle="$emit('toggle', $event)"
        />
      </ul>
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { ITreeItem } from "@/interface/vuex/modules/sideBar";
import { BUS_FILE } from "@/common/bus-channel";
import { hasKeys } from "@/common/utils";

@Component({
  name: "TreeItem",
})
export default class TreeItem extends Vue {
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
    const index = value.indexOf(".md");
    if (index !== -1) {
      return value.substring(0, index);
    } else {
      return value;
    }
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
  border-right: 0.1px solid rgba(200, 200, 200, 0.6);
}

.file:hover,
.folder:hover {
  background-color: #ecdeb4;
}
</style>
