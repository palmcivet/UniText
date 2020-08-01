<template>
  <section>
    <header>
      <!-- 工具栏 -->
      <div v-if="folderDir === ''">无打开的文件/文件夹</div>
      <div v-else>
        <span>文件管理</span>
        <button @click="toggleAll()">收</button>
      </div>
    </header>

    <div v-if="folderDir === ''">
      <button @click="openDialog()">打开文件夹</button>
    </div>
    <div v-else>
      <tree-view :data="fileData" :toggle="notCollapse"></tree-view>
    </div>
  </section>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, remote } from "electron";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";
import draggable from "vuedraggable";
import * as fse from "fs-extra";

import { ITreeItem } from "@/interface/view";
import TreeView from "@/common/widgets/TreeView/Index.vue";
import { FILE } from "@/common/busChannel";

const editor = namespace("editor");
const general = namespace("general");
const sideBar = namespace("sideBar");

@Component({
  name: "File",
  components: {
    draggable,
    TreeView,
  },
})
export default class Files extends Vue {
  @general.State("notesPath")
  defaultFolder!: string;

  folderDir = "/Users/palmcivet/Documents/Develop/Preparing/PKM/测试笔记";

  @sideBar.State("files")
  stateFiles!: {
    folderTree: Array<ITreeItem>;
    ignoreFile: Array<string>;
  };

  @Watch("folderDir")
  handleFolder() {
    this.fileData = this.buildFileTree("");
  }

  notCollapse = true;

  fileData: Array<ITreeItem> = [];

  toggleAll() {
    this.notCollapse = false;
    setTimeout(() => {
      this.notCollapse = true;
    }, 100);
  }

  openDialog() {
    remote.dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory", "createDirectory"],
      })
      .then((res) => {
        this.folderDir = res.filePaths[0] || "";
      });
  }

  @editor.Action("OPEN_FILE")
  OPEN_FILE!: (path: string) => void;

  buildFileTree(path: string) {
    const fileTree: Array<ITreeItem> = [];
    fse
      .readdir(`${this.folderDir}/${path}`)
      .then((res) => {
        return res;
      })
      .then((res) => {
        res.forEach((item) => {
          if (this.stateFiles.ignoreFile.indexOf(item) !== -1) {
            return;
          }

          const subTree: ITreeItem = {
            name: item,
            path: `${path}/${item}`,
          };

          if (fse.lstatSync(`${this.folderDir}/${subTree.path}`).isDirectory()) {
            fileTree.push({
              file: this.buildFileTree(subTree.path),
              ...subTree,
            });
          } else {
            fileTree.push(subTree);
          }
        });
      });
    return fileTree;
  }

  mounted() {
    if (this.folderDir !== "") {
      this.handleFolder();
    }

    this.$bus.$on(FILE.OPEN_FILE, (value: string) => {
      this.OPEN_FILE(`${this.folderDir}${value}`);
    });
  }
}
</script>

<style lang="less" scoped>
section {
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    color: #252525;
    background-color: rgb(251, 255, 227);
    box-shadow: 0px 0px 5px rgba(210, 238, 153, 0.6);

    > div {
      height: 25px;
      line-height: 25px;
    }
  }

  > div {
    height: calc(100% - 25px);
    position: relative;

    > button {
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 0.5em;
      transform: translate(-50%, 50%);
      color: whitesmoke;
      background-color: #55aaf3;
      box-shadow: 3px 3px 6px rgba(123, 194, 245, 0.6);
      border-radius: 2px;
      outline-style: none;
    }
  }
}
</style>
