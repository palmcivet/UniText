<template>
  <div>
    <Preference />
    <button>保存</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import Preference from "./Preference.vue";
import { BUS_SIDEBAR } from "@/common/channel/bus";
import { ESettingType, EView } from "@/typings/vuex/workBench";

const workBench = namespace("workBench");

@Component({
  name: "Setting",
  components: {
    Preference,
  },
})
export default class Setting extends Vue {
  @workBench.Mutation("SET_VIEW")
  SET_VIEW!: (type: EView) => void;

  @workBench.Mutation("SWITCH_SETTING")
  SWITCH_SETTING!: (type: ESettingType) => void;

  handleSwtichSetting(type: ESettingType) {
    this.SET_VIEW(EView.SETTING);
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

<style lang="less" scoped></style>
