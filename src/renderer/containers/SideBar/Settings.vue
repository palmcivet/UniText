<template>
  <div>
    <BaseView>
      <template slot="view-title">
        <span>{{ $t("sidebar.settings") }}</span>
      </template>

      <template slot="view">
        <ul>
          <li v-for="(i, k) in settingGroup" :key="k">
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
        title: this.$t("sidebar.settingsPreference"),
      },
      {
        icon: "ri-keyboard-line",
        title: this.$t("sidebar.settingsKeybinding"),
      },
      {
        icon: "ri-braces-fill",
        title: this.$t("sidebar.settingsSnippet"),
      },
      {
        icon: "ri-t-shirt-2-line",
        title: this.$t("sidebar.settingsTheme"),
      },
    ];
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
