<template>
  <h3 class="group-h2" id="theme">
    <div class="group-title">{{ $g(overview.title) }}</div>
    <div class="group-description">{{ $g(overview.description) }}</div>
  </h3>

  <div class="group-option">
    <div class="group-code">
      <span>{{ "overview" }}</span>
      <span>.</span>
      <span>{{ "dynamic" }}</span>
    </div>
    <component
      :is="overview.properties.dynamic.type"
      :prop="overview.properties.dynamic"
      :value="userData['overview']['dynamic']"
      @u-change="onChangeSetting(['overview', 'dynamic', $event])"
    />
  </div>

  <div class="group-option">
    <div class="group-code">
      <span>{{ "overview" }}</span>
      <span>.</span>
      <span>{{ "preset" }}</span>
    </div>
    <DropDown
      :prop="selectScheme"
      :value="userData['overview']['preset']"
      @u-change="onChangeSetting(['overview', 'preset', $event])"
    />
  </div>

  <template v-if="showCustom">
    <h3 class="group-h2" id="custom">
      <div class="group-title">{{ $g(custom.title) }}</div>
      <div class="group-description">{{ $g(custom.description) }}</div>
    </h3>

    <div
      class="group-option"
      v-for="(_properties, secondKey, i) of custom.properties"
      :key="i"
    >
      <div class="group-code">
        <span>{{ "custom" }}</span>
        <span>.</span>
        <span>{{ secondKey }}</span>
      </div>
      <component
        :is="_properties.type"
        :prop="_properties"
        :value="userData['custom'][secondKey]"
        @u-change="onChangeSetting(['custom', secondKey, $event])"
      />
    </div>
  </template>

  <div class="group-divider"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { schemaTheme } from "@/shared/schema/theme";
import CheckBox from "./Form/CheckBox.vue";
import DropDown from "./Form/DropDown.vue";
import TextBox from "./Form/TextBox.vue";
import { useService } from "@/renderer/composables";

export default defineComponent({
  name: "ThemeGroup",

  components: {
    CheckBox,
    TextBox,
    DropDown,
  },

  inject: ["$theme"],

  props: {
    userData: { type: Object, required: true },
  },

  data() {
    return {
      selectScheme: {
        title: ["主题方案"],
        type: "DropDown",
        description: [""],
        enum: [""],
        default: "",
      },

      showCustom: false,
    };
  },

  computed: {
    overview() {
      return schemaTheme.overview;
    },

    custom() {
      return schemaTheme.custom;
    },
  },

  methods: {
    onChangeSetting(value: Array<any>) {
      const [firstKey, secondKey, newValue] = value;
      if (firstKey === "overview" && secondKey === "preset") {
        this.showCustom = newValue === "Custom";
      }
      useService("SettingService").setSetting(
        "theme",
        `${firstKey}.${secondKey}` as any,
        newValue
      );
    },
  },

  async mounted() {
    const list = await this.$theme.getSelectedTheme();
    this.selectScheme.enum = list;
    this.selectScheme.default = list[0];
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
