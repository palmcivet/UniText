<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <Group
      v-for="(v, k, i) of schema.otherGroup"
      :key="i"
      :userData="userData"
      :properties="v"
      :field="k"
      @item-submit="handleSubmit($event)"
    />

    <div class="group">
      <div class="title">{{ $g(schema.title) }}</div>
      <div class="items">
        <CheckBox
          :group="'color'"
          :field="'dynamic'"
          :properties="schema.dynamic"
          :val="getVal('color', 'dynamic')"
          @item-change="handleSubmit($event)"
        />

        <DropDown
          :group="'color'"
          :field="'preset'"
          :properties="selectScheme"
          :val="getVal('color', 'preset')"
          @item-change="handleSubmitChoose($event)"
        />

        <TextBox
          v-for="(v, k, i) of schema.customGroup"
          :key="i"
          :field="k"
          :group="'color'"
          :properties="v"
          :userData="userData"
          :isDisable="!isCustom"
          :val="getVal('color', k)"
          @item-change="handleSubmitCheck($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";
import * as fse from "fs-extra";

import { debounce } from "@/common/utils";
import { IPC_THEME } from "@/common/channel/ipc";
import { checkFilesExist, joinPath } from "@/common/fileSystem";
import { CONFIG_FOLDER, THEME_CSS, THEME_JS, THEME_PRESET } from "@/common/env";
import { schemaTheme } from "@/main/schema/sTheme";
import Group from "@/renderer/components/Form/Group.vue";
import TextBox from "@/renderer/components/Form/TextBox.vue";
import CheckBox from "@/renderer/components/Form/CheckBox.vue";
import DropDown from "@/renderer/components/Form/DropDown.vue";
import { IGeneralState } from "@/typings/vuex/general";

const general = namespace("general");

const themeFileName = [
  ...THEME_CSS.map((item) => item + ".css"),
  ...THEME_JS.map((item) => item + ".js"),
];

@Component({
  name: "Theme",
  components: {
    Group,
    TextBox,
    CheckBox,
    DropDown,
  },
})
export default class Theme extends Vue {
  @general.State((state: IGeneralState) => state.fileManager.folderDir)
  folderDir!: string;

  userData: any = {};

  watcher!: fse.FSWatcher;

  selectScheme = {
    title: ["主题方案"],
    description: ["主题的默认方案"],
    enum: [...THEME_PRESET],
    default: THEME_PRESET[0][0],
  };

  get isCustom() {
    const selected = this.getVal("color", "preset");
    return selected === "Custom";
  }

  data() {
    return {
      userData: {},
    };
  }

  setVal(g: string, f: string, v: any) {
    this.userData[g][f] = v;
  }

  getVal(g: string, f: string) {
    return this.userData[g][f];
  }

  get themeDir() {
    return joinPath(this.folderDir, CONFIG_FOLDER.THEMES);
  }

  get schema() {
    const { color, ...otherGroup } = schemaTheme;
    const { dynamic, preset, ...customGroup } = color.properties;
    return {
      title: color.title,
      dynamic,
      otherGroup,
      customGroup,
    };
  }

  async updateSelectScheme() {
    const selfValue: Array<string> = [];
    const themeSet = await fse.readdir(this.themeDir);

    for await (const sub of themeSet) {
      const dir = joinPath(this.themeDir, sub);
      const res = await checkFilesExist(dir, themeFileName);
      if (res) selfValue.push(sub);
    }

    this.selectScheme = {
      ...this.selectScheme,
      enum: [...THEME_PRESET, ...selfValue],
    };
  }

  async handleSubmitCheck(val: [string, string, string]) {
    const dir = joinPath(this.folderDir, val[2]);
    if (await fse.pathExists(dir)) {
      this.handleSubmit(val);
    } else {
      // NOTE 路径错误
      console.log("路径错误");
    }
  }

  handleSubmitChoose(val: [string, string, string]) {
    // FEAT 实时预览
    this.handleSubmit(val);
  }

  handleSubmit = debounce((val: [string, string, string]) => {
    const [g, f, v] = val;
    this.setVal(g, f, v);
    ipcRenderer.send(IPC_THEME.SET_ITEM, `${g}.${f}`, v);
  }, 200);

  created() {
    this.userData = ipcRenderer.sendSync(IPC_THEME.GET_ALL_SYNC);
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
