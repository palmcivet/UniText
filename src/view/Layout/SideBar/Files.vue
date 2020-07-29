<template>
  <section>
    <header>
      <!-- 工具栏 -->
      <div v-if="folderDir === ''">无打开的文件/文件夹</div>
      <div v-else>工具栏</div>
    </header>

    <div v-if="folderDir === ''">
      <button @click="openDialog()">打开文件夹</button>
    </div>
    <div v-else>
      <tree-view></tree-view>
    </div>
  </section>
</template>

<script lang="ts">
import { ipcRenderer, IpcRendererEvent, remote } from "electron";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import draggable from "vuedraggable";
import * as fse from "fs-extra";
import TreeView from "@/common/widgets/TreeView/Index.vue";

@Component({
  name: "File",
  components: {
    draggable,
    TreeView,
  },
})
export default class Files extends Vue {
  @Prop({
    type: String,
    required: false,
    default: "/Users/palmcivet/Documents/Develop/Preparing/PKM/测试笔记", // DEV
  })
  targetFolder!: string;

  folderDir = this.targetFolder;

  openDialog() {
    remote.dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory", "createDirectory"],
      })
      .then((res) => {
        this.folderDir = res.filePaths[0] || "";
      });
  }

  @Watch("folderDir")
  parseFile() {
    fse
      .readdir(this.folderDir)
      .then((res) => {
        return res;
      })
      .then((res) => {
        res.forEach((item) => {
          // console.log(item, fse.lstatSync(`${this.folderDir}/${item}`).isDirectory());
        });
      });
  }

  mounted() {
    // TODO 打开后，遍历当前目录
    this.parseFile();
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
