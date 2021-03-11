<template>
  <div class="setting">
    <div class="operate-bar">
      <button class="unitext-button" @click="handleLoad()">载入设置</button>
      <button class="unitext-button" @click="handleReveal()">存储位置</button>
      <button class="unitext-button" @click="handleClose()">关闭</button>
    </div>

    <System v-if="settingType === 0" class="data-form" />
    <Preference v-if="settingType === 1" class="data-form" />
    <Markdown v-if="settingType === 2" class="data-form" />
    <Theme v-if="settingType === 3" class="data-form" />
    <Snippet v-if="settingType === 5" class="data-form" />
  </div>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import Theme from "./items/Theme.vue";
import System from "./items/System.vue";
import Snippet from "./items/Snippet.vue";
import Markdown from "./items/Markdown.vue";
import Preference from "./items/Preference.vue";
import { BUS_SIDEBAR } from "@/common/channel/bus";
import { ESettingType, EWorkBenchType, IWorkBenchState } from "@/typings/vuex/workBench";
const workBench = namespace("workBench");

@Component({
  name: "Setting",
  components: {
    Preference,
    Markdown,
    Snippet,
    System,
    Theme,
  },
})
export default class Setting extends Vue {
  @workBench.State((state: IWorkBenchState) => state.settingType)
  settingType!: ESettingType;

  @workBench.Mutation("SET_VIEW")
  SET_VIEW!: (type: EWorkBenchType) => void;

  @workBench.Mutation("SWITCH_SETTING")
  SWITCH_SETTING!: (type: ESettingType) => void;

  handleLoad() {
    const { commit, dispatch } = this.$store;
    dispatch("LOAD_STATE");
    commit("notification/NOTIFY", { level: "INFO", title: "载入成功" });
  }

  handleReveal() {}

  handleClose() {
    this.SET_VIEW(EWorkBenchType.EDITOR);
  }

  onSwtichSetting(type: ESettingType) {
    this.SET_VIEW(EWorkBenchType.SETTING);
    this.SWITCH_SETTING(type);
  }

  created() {
    this.$bus.on(BUS_SIDEBAR.SWITCH_SETTING, this.onSwtichSetting);
  }

  beforeDestroy() {
    this.$bus.off(BUS_SIDEBAR.SWITCH_SETTING, this.onSwtichSetting);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.setting {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .operate-bar {
    width: calc(100% - @scrollBar-width);
    top: 0;
    right: @scrollBar-width;
    position: absolute;
    backdrop-filter: blur(2px);
    display: flex;
    z-index: 999;
    justify-content: flex-end;
    box-shadow: var(--tabBarShadow-Color) 0 -2px 2px -2px inset;

    button {
      margin: 0 0.5em 0.5em 0;
    }
  }

  .data-form {
    overflow-y: auto;
    height: 100%;
    padding-top: 3em;
  }
}
</style>
