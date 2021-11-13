<template>
  <div class="setting">
    <div class="setting-controls">
      <div class="setting-search-box"></div>

      <div class="setting-button-group">
        <button class="unitext-button" @click="handleLoad()">载入设置</button>
        <button class="unitext-button" @click="handleReveal()">存储位置</button>
      </div>
    </div>

    <div class="setting-container" v-if="hasSetup">
      <div class="setting-toc">
        <a class="nav-1" href="#preference">偏好设置</a>
        <a class="nav-1" href="#markdown">Markdown</a>
        <a class="nav-1" href="#system">系统设置</a>
        <a class="nav-1" href="#snippet">主题样式</a>
        <a class="nav-1" href="#theme">代码片段</a>
        <a class="nav-1" href="#keybinding">按键绑定</a>
      </div>

      <h2 id="preference">偏好设置</h2>
      <SettingGroup
        v-for="(properties, key, index) of schemaPreference"
        :key="index"
        :userData="dataAll.preference"
        :properties="properties"
        :field="key"
        @submit="onSubmit($event)"
      />

      <h2 id="markdown">{{ "Markdown" }}</h2>
      <SettingGroup
        v-for="(properties, key, index) of schemaMarkdown"
        :key="index"
        :userData="dataAll.markdown"
        :properties="properties"
        :field="key"
        @submit="onSubmit($event)"
      />

      <h2 id="system">系统设置</h2>
      <SettingGroup
        v-for="(properties, key, index) of schemaSystem"
        :key="index"
        :userData="dataAll.system"
        :properties="properties"
        :field="key"
        @submit="onSubmit($event)"
      />

      <h2 id="Theme">主题样式</h2>
      <SettingGroup
        v-for="(properties, key, index) of schemaTheme"
        :key="index"
        :userData="dataAll.theme"
        :properties="properties"
        :field="key"
        @submit="onSubmit($event)"
      />

      <h2 id="snippet">代码片段</h2>
      <h2 id="keybinding">按键绑定</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";

import { schemaTheme } from "@/shared/schema/theme";
import { schemaSystem } from "@/shared/schema/system";
import { schemaMarkdown } from "@/shared/schema/markdown";
import { schemaPreference } from "@/shared/schema/preference";
import { useService } from "@/renderer/composables/service";
import { ISetting } from "@/shared/typings/setting";
import SettingGroup from "./SettingGroup.vue";

export default defineComponent({
  name: "Setting",

  components: {
    SettingGroup,
  },

  data() {
    return {
      schemaTheme,
      schemaSystem,
      schemaMarkdown,
      schemaPreference,
    };
  },

  setup() {
    const hasSetup = ref(false);
    const dataAll = ref<ISetting>();

    const setting = useService("SettingService");
    const allSetting = setting.getAll();

    onBeforeMount(async () => {
      dataAll.value = await (allSetting as unknown as Promise<ISetting>);
      hasSetup.value = true;
    });

    const onSubmit = (value: any) => {};

    const handleLoad = () => {};

    const handleReveal = () => {};

    return {
      hasSetup,
      dataAll,

      onSubmit,
      handleLoad,
      handleReveal,
    };
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";
@import "~@/renderer/styles/mixins.less";

.setting {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  &-button-group {
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

  @toc-width: 160px;
  @container-gap: 20px;
  @container-padding: 30px;

  &-container {
    height: 100%;
    margin-top: 40px;
    overflow-y: auto;
    padding-left: @container-padding + @container-gap + @toc-width;
    padding-right: @container-padding;
  }

  &-toc {
    left: @container-padding;
    width: @toc-width;
    position: absolute;

    .nav-1 {
      width: 100%;
      padding: 2px 4px;
      line-height: 24px;
      display: list-item;
      list-style: none;
      text-decoration: none;
      color: var(--formGroup-Fg);
      .ellipsis();

      &:hover {
        color: var(--formGroup-hoverFg);
        background-color: var(--formGroup-hoverBg);
      }
    }
  }

  h2 {
    margin: 0;
    padding: 0;
  }
}
</style>
