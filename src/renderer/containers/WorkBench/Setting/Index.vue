<template>
  <div class="setting">
    <!-- FEAT i18n -->
    <div class="header">{{ "首选项" }}</div>

    <Preference />

    <div class="operate">
      <button>查看存储位置</button>
      <button>恢复默认值</button>
      <button>保存(⌘S)</button>
    </div>
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

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

.setting {
  height: 100%;
  position: relative;
  padding: 0rem 3rem;

  > .header {
    font-size: 1.8em;
    font-weight: 500;
    text-align: center;
    -webkit-user-select: none;
  }

  > .operate {
    position: absolute;
    bottom: 1em;
    right: 1em;

    button {
      margin-left: 1em;
      padding: 0.3em 0.4em;

      #button-style();
    }
  }
}
</style>
