<template>
  <div class="setting">
    <Preference class="type" />

    <div class="operate">
      <button class="unitext-button">查看存储位置</button>
      <button class="unitext-button">恢复默认值</button>
      <button class="unitext-button">保存(⌘S)</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Preference from "./Preference.vue";
import { BUS_SIDEBAR } from "@/common/channel/bus";
import { ESettingType, EWorkBenchType } from "@/typings/vuex/workBench";

const workBench = namespace("workBench");

@Component({
  name: "Setting",
  components: {
    Preference,
  },
})
export default class Setting extends Vue {
  @workBench.Mutation("SET_VIEW")
  SET_VIEW!: (type: EWorkBenchType) => void;

  @workBench.Mutation("SWITCH_SETTING")
  SWITCH_SETTING!: (type: ESettingType) => void;

  handleSwtichSetting(type: ESettingType) {
    this.SET_VIEW(EWorkBenchType.SETTING);
    this.SWITCH_SETTING(type);
  }

  created() {
    this.$bus.on(BUS_SIDEBAR.SWITCH_SETTING, this.handleSwtichSetting);
  }

  beforeDestory() {
    this.$bus.off(BUS_SIDEBAR.SWITCH_SETTING, this.handleSwtichSetting);
  }
}
</script>

<style lang="less" scoped>
.setting {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  > .type {
    overflow-y: auto;
    height: 100%;
    padding-bottom: 2em;
  }

  > .operate {
    width: 100%;
    bottom: 0;
    right: 0;
    position: absolute;
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: flex-end;

    button {
      margin: 0 0.5em 0.5em 0;
      padding: 0.3em 0.4em;
    }
  }
}
</style>
