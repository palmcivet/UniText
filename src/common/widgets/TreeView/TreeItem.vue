<template>
  <li>
    <div class="file" v-if="isFile" @click.stop="openFile()">
      <div class="indent" v-for="i in deepth - 1" :key="i"></div>

      <div>
        <pre class="icon"></pre>
        <pre class="space"></pre>
        <a-icon type="file" />
        {{ itemData.name }}
      </div>
    </div>

    <div class="folder" v-else @click.stop="toggleFolder()">
      <div>
        <div>
          <i :class="isOpen ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'"></i>
          <pre class="space"></pre>
          <a-icon type="folder-open" v-if="isOpen" />
          <a-icon type="folder" v-else />
          {{ itemData.name }}
        </div>

        <ul v-show="isOpen">
          <tree-item
            v-for="(subChild, subIndex) in itemData.children"
            :key="subIndex"
            :itemData="subChild"
            :deepth="deepth + 1"
          ></tree-item>
        </ul>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

export interface ITreeItem {
  name: string;
  children?: Array<ITreeItem>;
}

@Component({
  name: "TreeItem",
  filters: {
    trimSuffix: (value: string) => {
      const index = value.indexOf(".md");
      if (index !== -1) {
        return value.substring(0, index);
      } else {
        return "";
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
    type: Number,
    default: 1,
  })
  deepth!: number;

  isOpen = false;

  get isFile() {
    return this.itemData.children === undefined;
  }

  toggleFolder() {
    this.isOpen = !this.isOpen;
  }

  openFile() {}
}
</script>

<style lang="less" scoped>
* {
  -webkit-user-select: none;
}

li {
  background-color: #f3eddb;
  cursor: pointer;
  display: flex;
}

.file,
.folder {
  width: 100%;
  height: 100%;
  display: flex;

  div:last-child {
    width: 100%;
  }

  pre {
    height: 1em;
    margin: 0;
    display: inline-block;
    vertical-align: middle;

    &.icon {
      width: 1em;
    }

    &.space {
      width: 0.15em;
    }
  }
}

.indent {
  width: 0.45em;
  padding-right: 0.1em;
  border-right: 0.3px solid rgba(100, 100, 100, 0.9);
}

.file:hover {
  background-color: #ecdeb4;
  // background-color: #d1cbb8;
}

.folder {
  div > i:first-child {
    vertical-align: middle;
  }
}
</style>
