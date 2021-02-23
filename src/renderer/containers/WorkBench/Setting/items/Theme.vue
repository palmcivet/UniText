<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <Group
      v-for="(v, k, i) of schema.otherGroup"
      :key="i"
      :field="k"
      :properties="v"
      :userData="userData"
      @submit="handleSubmit($event)"
    />

    <UFormGroup :label="schema.title">
      <div>
        <GroupHead field="color" subField="dynamic" />
        <UCheckBox
          :prop="schema.dynamic"
          :value="getVal('color', 'dynamic')"
          @change="handleSubmit(['color', 'dynamic', $event])"
        />
      </div>

      <div>
        <GroupHead field="color" subField="preset" />
        <DropDown
          :prop="selectScheme"
          :value="getVal('color', 'preset')"
          @change="handleSubmitChoose(['color', 'preset', $event])"
        />
      </div>

      <div v-for="(v, k, i) of schema.customGroup" :key="i">
        <GroupHead field="color" :subField="k" />
        <UInputText
          :prop="v"
          :value="getVal('color', k)"
          :hasDisabled="!isCustom"
          @change="handleSubmitCheck(['color', k, $event])"
        />
      </div>
    </UFormGroup>
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
import Group from "../widgets/Group.vue";
import GroupHead from "../widgets/GroupHead.vue";
import DropDown from "../widgets/DropDown.vue";
import UCheckBox from "@/renderer/components/Form/UCheckBox.vue";
import UInputText from "@/renderer/components/Form/UInputText.vue";
import UFormGroup from "@/renderer/components/Form/UFormGroup.vue";
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
    GroupHead,
    DropDown,
    UCheckBox,
    UInputText,
    UFormGroup,
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

<style lang="less" scoped>
@import "../widgets/style.less";
</style>
