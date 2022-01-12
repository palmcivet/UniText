<template>
  <div class="setting">
    <div class="setting-controls">
      <div class="controls-button-group">
        <button class="unitext-button" @click="onLoadSetting()">载入设置</button>
        <button class="unitext-button" @click="onRevealSetting()">存储位置</button>
      </div>

      <div class="controls-search-box">
        <input
          class="search-box"
          type="search"
          v-model="keyword"
          placeholder="搜索设置"
        />
        <i class="search-clear ri-filter-off-line" @click="keyword = ''"></i>
      </div>
    </div>

    <div class="setting-options" v-if="hasSetup">
      <div class="options-toc">
        <template v-for="(nav, index) in navList" :key="index">
          <a class="group-nav-1" :href="nav.href" :draggable="false">{{ nav.label }}</a>
          <a
            class="group-nav-2"
            v-for="(subNav, id) in nav.child"
            :key="id"
            :href="subNav.href"
            :draggable="false"
          >
            {{ subNav.label }}
          </a>
        </template>
      </div>

      <div class="options-container">
        <template v-for="(schema, key, index) of schemaMap" :key="index">
          <h2 class="group-h1" :id="key">{{ key }}</h2>

          <template v-for="(subSchema, firstKey, id) of schema" :key="id">
            <h3 class="group-h2" :id="firstKey">
              <div class="group-title">{{ $g(subSchema.title) }}</div>
              <div class="group-description">{{ $g(subSchema.description) }}</div>
            </h3>

            <div
              class="group-option"
              v-for="(_properties, secondKey, i) of subSchema.properties"
              :key="i"
            >
              <div class="group-code">
                <span>{{ firstKey }}</span>
                <span>.</span>
                <span>{{ secondKey }}</span>
              </div>
              <component
                :is="_properties.type"
                :prop="_properties"
                :value="dataAll[key][firstKey][secondKey]"
                @u-change="onChangeSetting([key, firstKey, secondKey, $event])"
              />
            </div>
          </template>

          <div class="group-divider"></div>
        </template>

        <h2 class="group-h1" :id="navList.at(-3).href.replace('#', '')">
          {{ navList.at(-3).label }}
        </h2>
        <SnippetGroup :schema="schemaSnippet.properties" :userData="dataAll.snippet" />

        <!--
        <h2 class="group-h1" :id="navList.at(-2).href.replace('#', '')">
          {{ navList.at(-2).label }}
        </h2>

        <h2 class="group-h1" :id="navList.at(-1).href.replace('#', '')">
          {{ navList.at(-1).label }}
        </h2>
        -->

        <!-- 其他交互逻辑的控件 -->
        <!-- 导入、批量导出、debug 模式、上传工具、测试上传、auth -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";

import { useShell, useService } from "@/renderer/composables";
import { schemaTheme } from "@/shared/schema/theme";
import { schemaSystem } from "@/shared/schema/system";
import { schemaSnippet } from "@/shared/schema/snippet";
import { schemaMarkdown } from "@/shared/schema/markdown";
import { schemaPreference } from "@/shared/schema/preference";
import { BUS_CHANNEL } from "@/shared/channel";
import { ISetting } from "@/shared/typings/setting";
import Range from "./Form/Range.vue";
import TextBox from "./Form/TextBox.vue";
import DropDown from "./Form/DropDown.vue";
import CheckBox from "./Form/CheckBox.vue";
import TextGroup from "./Form/TextGroup.vue";
import SnippetGroup from "./SnippetGroup.vue";

interface INavItem {
  label: string;
  href: string;
  child: Array<INavItem>;
}

export default defineComponent({
  name: "Setting",

  inject: ["$bus"],

  components: {
    SnippetGroup,
    Range,
    CheckBox,
    TextBox,
    TextGroup,
    DropDown,
  },

  data() {
    return {
      navList: [] as Array<INavItem>,
      schemaMap: {
        system: schemaSystem,
        preference: schemaPreference,
        markdown: schemaMarkdown,
        theme: schemaTheme,
      },
      schemaSnippet,
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

    const onRevealSetting = async () => {
      return useShell().showItemInFolder(
        await useService("EnvService").resolveCabinFile("SETTING")
      );
    };

    const keyword = ref("");
    const onSearch = () => {};

    return {
      hasSetup,
      dataAll,

      keyword,
      onSearch,

      onRevealSetting,
    };
  },

  mounted() {
    Object.entries(this.schemaMap).forEach(([schemaName, schema]) => {
      const child = Object.entries(schema).map(([key, subSchema]) => ({
        label: subSchema.title[0],
        href: `#${key}`,
        child: [],
      }));

      this.navList.push({
        label: schemaName.replace("schema", ""),
        href: `#${schemaName.replace("schema", "")}`,
        child,
      });
    });

    this.navList.push(
      ...[
        {
          label: "代码片段",
          href: `#snippet`,
          child: [
            { label: "fragment", href: "#fragment", child: [] },
            { label: "template", href: "#template", child: [] },
          ],
        },
        // { label: "快捷键", href: `#keybinding`, child: [] },
        // { label: "插件", href: `#plugin`, child: [] },
      ]
    );
  },

  methods: {
    onChangeSetting([module, key, subKey, value]: any) {
      try {
        useService("SettingService").setSetting(module, `${key}.${subKey}`, value);
      } catch (error) {
        // FEAT 输出错误
      }
    },

    async onLoadSetting() {
      this.$bus.emit(BUS_CHANNEL.UPDATE_SETTING);
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/vars.less";
@import "~@/renderer/styles/mixins.less";
@import "./style.less";

.setting {
  @controls-height: 46px;
  @toc-width: 160px;
  @padding-y: 10px;
  @padding-x: 30px;

  height: 100%;

  &-controls {
    display: flex;
    align-items: center;
    height: @controls-height;
    padding: 0 @padding-x;

    .controls-button-group {
      display: flex;
      justify-content: space-around;
      height: 30px;
      width: @toc-width;
    }

    .controls-search-box {
      height: 30px;
      width: calc(100% - 160px);
      margin-left: @padding-x;
      background-color: var(--inputBox-Bg);
      display: flex;
      align-items: center;

      .search-box {
        height: 30px;
        width: calc(100% - 30px);
        padding-left: 5px;
        font-size: 15px;
        color: var(--inputBox-Fg);
        background-color: var(--inputBox-Bg);
      }

      .search-clear {
        cursor: pointer;
        font-size: 1.5em;
        background-color: var(--inputBox-Bg);
      }
    }
  }

  &-options {
    height: calc(100% - @controls-height);
    padding: 0 0 0 @padding-x;
    position: relative;

    &::before {
      content: " ";
      position: absolute;
      top: 0;
      left: @padding-x;
      right: @padding-x;
      border-top: 1px solid rgb(53, 53, 53);
    }

    .options-toc {
      width: calc(@toc-width - @padding-x);
      height: calc(100% - @padding-y * 2);
      overflow-y: auto;
      display: inline-block;
      margin: @padding-y @padding-x @padding-y 0;
      vertical-align: top;
      transition: width 0.2s ease-out;

      @media screen and (max-width: 768px) {
        width: 0;
      }

      @decoration-width: 6px;
      @padding-toc-x: 4px;

      .group-nav-1,
      .group-nav-2,
      .group-nav-3 {
        width: 100%;
        padding: 2px 4px;
        line-height: 24px;
        display: list-item;
        list-style: none;
        .ellipsis();

        &:hover {
          color: var(--formGroup-hoverFg);
          background-color: var(--formGroup-hoverBg);
        }
      }

      a {
        color: var(--formGroup-Fg);
        text-decoration: none;
      }

      .group-nav-1 {
        font-weight: bold;

        &::before {
          content: "";
          height: 24px;
          border-left: ridge @decoration-width var(--formGroupTitleBorder-Color);
          margin-right: 10px;
        }
      }

      .group-nav-2 {
        padding-left: @padding-toc-x + @decoration-width + 10px;
      }

      .group-nav-3 {
        padding-left: @padding-toc-x + @decoration-width + 14px;
      }
    }

    .options-container {
      width: calc(100% - @toc-width);
      height: 100%;
      display: inline-block;
      padding: @padding-y @padding-x @padding-y 0;
      overflow-y: auto;

      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }

  @media screen and (min-width: 1440px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-controls,
    &-options {
      width: 1024px;
    }
  }
}
</style>
