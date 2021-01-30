<template>
  <div>
    <BaseView>
      <template slot="view-title">
        <span>{{ $t("sidebar.settings") }}</span>
      </template>

      <template slot="view">
        <ul>
          <li v-for="(i, k) in settingGroup" :key="k" @click="switchSetting(i.type)">
            <i :class="true ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'" />
            <i :class="i.icon" />
            <pre class="space" />
            <span>{{ i.title }}</span>
          </li>
        </ul>
      </template>
    </BaseView>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import BaseView from "./BaseView.vue";
import { BUS_SIDEBAR } from "@/common/channel/bus";
import { ESettingType } from "@/typings/vuex/workBench";

@Component({
  name: "Settings",
  components: {
    BaseView,
  },
})
export default class Settings extends Vue {
  get settingGroup() {
    return [
      {
        icon: "ri-settings-3-line",
        type: ESettingType.PREFERENCE,
        title: this.$t("sidebar.settings_preference"),
      },
      {
        icon: "ri-keyboard-line",
        type: ESettingType.KEYBINDING,
        title: this.$t("sidebar.settings_keybinding"),
      },
      {
        icon: "ri-braces-fill",
        type: ESettingType.SNIPPET,
        title: this.$t("sidebar.settings_snippet"),
      },
      {
        icon: "ri-t-shirt-2-line",
        type: ESettingType.THEME,
        title: this.$t("sidebar.settings_theme"),
      },
    ];
  }

  switchSetting(type: ESettingType) {
    this.$bus.emit(BUS_SIDEBAR.SWITCH_SETTING, type);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

* {
  -webkit-user-select: none;
}

li {
  height: @sidebar-item-height;
  display: flex;
  align-items: center;
  cursor: pointer;

  .space {
    width: 0.2em;
  }

  &:hover {
    background-color: #e8e7e1;
  }
}
</style>
