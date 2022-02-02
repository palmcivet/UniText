<template>
  <div class="browser-search">
    <div class="browser-toolbar">
      <div class="toolbar-label">{{ $t("sidebar.search") }}</div>
      <div class="toolbar-controls">
        <i
          class="ri-refresh-line"
          :title="$t('sidebar.search_refresh')"
          @click="onSearch()"
        />
        <i
          class="ri-filter-off-line"
          :title="$t('sidebar.search_clear')"
          @click="onClearSearch()"
        />
      </div>
    </div>

    <div class="browser-container">
      <div class="search-widget">
        <FormInput
          type="text"
          :value="keyword"
          placeholder="搜索"
          @form-change="onSearch($event)"
        />
        <div class="widget-wrapper">
          <div
            :class="parameter.isCaseSensitive ? 'active' : ''"
            @click="parameter.isCaseSensitive = !parameter.isCaseSensitive"
          >
            <i class="ri-a-b" title="大小写" />
          </div>
          <div
            :class="parameter.isWholeWord ? 'active' : ''"
            @click="parameter.isWholeWord = !parameter.isWholeWord"
          >
            <i class="ri-bar-chart-horizontal-line" title="全字匹配" />
          </div>
          <div
            :class="parameter.isRegexp ? 'active' : ''"
            @click="parameter.isRegexp = !parameter.isRegexp"
          >
            <i class="ri-registered-line" title="正则" />
          </div>
          <div
            :class="parameter.isInclude ? 'active' : ''"
            @click="parameter.isInclude = !parameter.isInclude"
          >
            <i class="ri-add-circle-line" title="包含" />
          </div>
          <div
            :class="parameter.isExclude ? 'active' : ''"
            @click="parameter.isExclude = !parameter.isExclude"
          >
            <i class="ri-subtract-line" title="排除" />
          </div>
        </div>
        <FormInput
          v-if="parameter.isInclude"
          type="text"
          placeholder="包含文件"
          :value="searchInclusions"
          @form-change="searchInclusions = $event"
        />
        <FormInput
          v-if="parameter.isExclude"
          type="text"
          placeholder="排除文件"
          :value="searchExclusions"
          @form-change="searchExclusions = $event"
        />
      </div>

      <ul class="search-result">
        <BrowserSearchNode
          v-show="keyword.length !== 0"
          v-for="(result, index) in searchResultList"
          :key="index"
          :result="result"
        />
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRaw } from "vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";
import { useDisk, useService } from "@/renderer/composables";
import { IRipgrepSearchResult } from "@/main/utils/ripgrep";
import BrowserSearchNode from "./BrowserSearchNode.vue";

export default defineComponent({
  name: "Search",

  components: {
    FormInput,
    BrowserSearchNode,
  },

  setup() {
    const cabinPath = ref("");
    onMounted(async () => {
      cabinPath.value = await useService("EnvService").getCabinPath();
    });

    const keyword = ref("");
    // const searchResultList = ref<Array<IRipgrepSearchResult>>([]);
    const searchResultList = ref<Array<IRipgrepSearchResult>>([
      {
        filePath:
          "/Users/palmcivet/Documents/Develop/Dealing/PKM/测试笔记/环境与工具/生产工具/VS Code/项目分析.md",
        matches: [
          {
            matchText: "markdown",
            lineText:
              "    │   ├── common  # diff描述，markdown解析器，worker协议，各种工具函数",
            lineTextOffset: 0,
            range: [
              [21, 29],
              [21, 37],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
        ],
      },
      {
        filePath:
          "/Users/palmcivet/Documents/Develop/Dealing/PKM/测试笔记/环境与工具/桌面环境/笔记 - macOS.md",
        matches: [
          {
            matchText: "mArkdown",
            lineText: "- qlmArkdown 预览 Markdown",
            lineTextOffset: 0,
            range: [
              [211, 4],
              [211, 12],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "- qlmArkdown 预览 Markdown",
            lineTextOffset: 0,
            range: [
              [211, 18],
              [211, 18],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
        ],
      },
      {
        filePath:
          "/Users/palmcivet/Documents/Develop/Dealing/PKM/测试笔记/环境与工具/生产工具/VS Code/使用 - 扩展.md",
        matches: [
          {
            matchText: "Markdown",
            lineText: "- 高亮 Markdown",
            lineTextOffset: 0,
            range: [
              [222, 5],
              [222, 13],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
        ],
      },
      {
        filePath:
          "/Users/palmcivet/Documents/Develop/Dealing/PKM/测试笔记/环境与工具/Markdown/Markdown 语法.md",
        matches: [
          {
            matchText: "Markdown",
            lineText: "- 数字加点`.`，空一格 ` `再填写内容，可嵌套 Markdown 语法\r",
            lineTextOffset: 0,
            range: [
              [35, 27],
              [35, 35],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [37, 3],
              [37, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "- 可多层嵌套 Markdown 语法\r",
            lineTextOffset: 0,
            range: [
              [53, 8],
              [53, 16],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [55, 3],
              [55, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [77, 3],
              [77, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [101, 3],
              [101, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [111, 3],
              [111, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [119, 3],
              [119, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "Markdown 兼容 *HTML* 标记语言，可使用 *HTML* 的 `div` 标签\r",
            lineTextOffset: 0,
            range: [
              [125, 0],
              [125, 8],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "### Markdown\r",
            lineTextOffset: 0,
            range: [
              [154, 4],
              [154, 12],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "```Markdown\r",
            lineTextOffset: 0,
            range: [
              [155, 3],
              [155, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "- 支持子列表嵌套 Markdown 语法\r",
            lineTextOffset: 0,
            range: [
              [203, 10],
              [203, 18],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "```markdown\r",
            lineTextOffset: 0,
            range: [
              [205, 3],
              [205, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "- [ ] **Markdown 开发**\r",
            lineTextOffset: 0,
            range: [
              [206, 8],
              [206, 16],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "- [ ] **Markdown 开发**\r",
            lineTextOffset: 0,
            range: [
              [217, 8],
              [217, 16],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "Markdown",
            lineText: "*Visual Studio Code* 插件 Markdown Preview Enhanced\r",
            lineTextOffset: 0,
            range: [
              [252, 24],
              [252, 32],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
          {
            matchText: "markdown",
            lineText: "        ```markdown\r",
            lineTextOffset: 0,
            range: [
              [256, 11],
              [256, 19],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
        ],
      },
      {
        filePath:
          "/Users/palmcivet/Documents/Develop/Dealing/PKM/测试笔记/环境与工具/Markdown/Pandoc 参考.md",
        matches: [
          {
            matchText: "markdown",
            lineText: "```markdown",
            lineTextOffset: 0,
            range: [
              [39, 3],
              [39, 11],
            ],
            leadingContextLines: [],
            trailingContextLines: [],
          },
        ],
      },
    ]);
    const onSearch = async (newValue: string) => {
      keyword.value = newValue;

      const result = await useDisk().externalRipgrep([cabinPath.value], keyword.value, {
        isCaseSensitive: parameter.isCaseSensitive,
        isWholeWord: parameter.isWholeWord,
        isRegexp: parameter.isRegexp,
        inclusions: toRaw(searchInclusions.value),
        exclusions: toRaw(searchExclusions.value),
      });
      searchResultList.value = result;
    };
    const onClearSearch = () => {
      keyword.value = "";
    };

    const parameter = reactive({
      isCaseSensitive: false,
      isWholeWord: false,
      isRegexp: false,
      isInclude: false,
      isExclude: false,
    });

    const searchInclusions = ref<Array<string>>([]);
    const searchExclusions = ref<Array<string>>([]);

    return {
      keyword,
      searchResultList,

      onSearch,
      onClearSearch,

      parameter,

      searchInclusions,
      searchExclusions,
    };
  },

  methods: {
    onReveal(path: string, range: [[number, number], [number, number]]) {
      console.log(path, range);
    },
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.browser-search {
  .browser-container {
    display: flex;
    flex-direction: column;

    .search-widget {
      .widget-wrapper {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;

        div {
          width: 20px;
          height: 20px;
          cursor: pointer;
          text-align: center;

          i {
            line-height: 20px;
          }

          &:hover {
            color: #efefef; // DEV
          }

          &.active {
            color: var(--sideBarItem-hoverFg);
            background: #414958; // DEV
          }
        }
      }
    }

    .search-result {
      height: 100%;
      overflow-y: overlay;
    }
  }
}
</style>
