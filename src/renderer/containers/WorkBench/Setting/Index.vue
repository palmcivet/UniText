<template>
  <div class="setting">
    <div class="operate">
      <button class="unitext-button" @click="handleReveal()">存储位置</button>
      <button class="unitext-button" @click="handleClose()">关闭</button>
    </div>

    <Preference class="type" />
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

  > .type {
    overflow-y: auto;
    height: 100%;
    padding-top: 2em;
  }

  > .operate {
    width: calc(100% - @scrollBar-width);
    top: 0;
    right: @scrollBar-width;
    position: absolute;
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: flex-end;
    box-shadow: var(--tabBarShadow-Color) 0 -2px 2px -2px inset;

    button {
      margin: 0 0.5em 0.5em 0;
      padding: 0.3em 0.4em;
    }
  }
}
</style>
