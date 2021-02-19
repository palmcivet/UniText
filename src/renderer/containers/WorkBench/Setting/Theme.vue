<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <Group
      v-for="(v, k, i) of scheme.otherGroup"
      :key="i"
      :userData="userData"
      :properties="v"
      :field="k"
      @item-submit="handleSubmit($event)"
    />

    <CheckBox
      :group="'color'"
      :field="'dynamic'"
      :properties="scheme.dynamic"
      :val="userData['color']['dynamic']"
      @item-change="$emit('item-submit', $event)"
    />

    <div v-if="isPreset" :title="$g(selectScheme.description)">
      <label>{{ $g(selectScheme.title) }}</label>
      <select v-model="selectedItem" @change="handleChoose()">
        <option v-for="(i, k) in selectScheme.enum" :value="i[1]" :key="k">
          {{ i[0] }}
        </option>
      </select>
    </div>

    <Group
      v-else
      v-for="(v, k, i) of scheme.customGroup"
      :key="i"
      :userData="userData"
      :properties="v"
      :field="k"
      @item-submit="handleSubmit($event)"
    />
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as fse from "fs-extra";

import { debounce } from "@/common/utils";
import { IPC_THEME } from "@/common/channel/ipc";
import { checkDir, joinPath } from "@/common/fileSystem";
import { CONFIG_FOLDER, THEME_FILENAME, THEME_PRESET } from "@/common/env";
import { schemaTheme } from "@/main/schema/sTheme";
import Group from "@/renderer/components/Form/Group.vue";
import CheckBox from "@/renderer/components/Form/CheckBox.vue";
import { IGeneralState } from "@/typings/vuex/general";

const general = namespace("general");

@Component({
  name: "Theme",
  components: {
    Group,
    CheckBox,
  },
})
export default class Theme extends Vue {
  @general.State((state: IGeneralState) => state.fileManager.folderDir)
  folderDir!: string;

  userData: any = {};

  isPreset = true;

  watcher!: fse.FSWatcher;

  selectedItem = "";

  selectScheme = {
    title: ["主题方案"],
    description: ["主题的默认方案"],
    enum: [...THEME_PRESET],
    default: THEME_PRESET[0][0],
  };

  data() {
    return {
      userData: {},
    };
  }

  setVal(g: string, f: string, v: any) {
    this.userData[g][f] = v;
  }

  get themeDir() {
    return joinPath(this.folderDir, CONFIG_FOLDER.THEMES);
  }

  get scheme() {
    const { color, ...otherGroup } = schemaTheme;
    const { dynamic, ...customGroup } = color.properties;
    return {
      dynamic,
      otherGroup,
      customGroup,
    };
  }

  async updateSelectScheme() {
    const selfValue: Array<string[]> = [];
    const themeSet = await fse.readdir(this.themeDir);

    for await (const sub of themeSet) {
      const dir = joinPath(this.themeDir, sub);
      const res = await checkDir(dir, THEME_FILENAME);
      if (res) selfValue.push([sub, dir]);
    }

    this.selectScheme = {
      ...this.selectScheme,
      enum: [...THEME_PRESET, ...selfValue],
    };
  }

  handleChoose() {
    ["appearance", "renderCode", "renderView"].forEach((item) => {
      ipcRenderer.send(
        IPC_THEME.SET_ITEM,
        `color.${item}`,
        joinPath(this.selectedItem, `${item}.css`)
      );
    });
    ipcRenderer.send(
      IPC_THEME.SET_ITEM,
      "color.monacoEditor",
      joinPath(this.selectedItem, "monacoEditor.js")
    );
  }

  handleSubmit = debounce((val: [string, string, any]) => {
    const [g, f, v] = val;
    this.setVal(g, f, v);
    ipcRenderer.send(IPC_THEME.SET_ITEM, `${g}.${f}`, v);
  }, 200);

  created() {
    this.userData = ipcRenderer.sendSync(IPC_THEME.GET_ALL_SYNC);
    this.selectedItem = this.userData.color.appearance;
  }

  mounted() {
    this.watcher = fse.watch(
      this.themeDir,
      { recursive: true, persistent: true },
      this.updateSelectScheme
    );
    this.updateSelectScheme();
  }

  beforeDestroy() {
    this.watcher.close();
  }
}
</script>

<style lang="less" scoped></style>
