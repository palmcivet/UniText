<template>
  <div class="browser-container">
    <div class="browser-title">
      <div class="title-label">{{ $t("view.browser.search.label") }}</div>
      <div class="title-actions">
        <i
          class="unitext-icon ri-refresh-line"
          :title="$t('view.browser.search.refresh')"
          @click="onSearch()"
        />
        <i
          class="unitext-icon ri-filter-off-line"
          :title="$t('view.browser.search.clear')"
          @click="onClearSearch()"
        />
      </div>
    </div>

    <div class="browser-view">
      <div class="search-widget">
        <FormInput
          type="text"
          :value="keyword"
          placeholder="搜索"
          @form-change="onSearch($event)"
        />
        <div class="widget-wrapper">
          <i
            class="unitext-icon ri-a-b"
            :class="parameter.isCaseSensitive ? 'active' : ''"
            title="大小写"
            @click="parameter.isCaseSensitive = !parameter.isCaseSensitive"
          />

          <i
            class="unitext-icon ri-bar-chart-horizontal-line"
            :class="parameter.isWholeWord ? 'active' : ''"
            title="全字匹配"
            @click="parameter.isWholeWord = !parameter.isWholeWord"
          />

          <i
            class="unitext-icon ri-registered-line"
            :class="parameter.isRegexp ? 'active' : ''"
            title="正则"
            @click="parameter.isRegexp = !parameter.isRegexp"
          />

          <i
            class="unitext-icon ri-add-circle-line"
            :class="parameter.isInclude ? 'active' : ''"
            title="包含"
            @click="parameter.isInclude = !parameter.isInclude"
          />

          <i
            class="unitext-icon ri-subtract-line"
            :class="parameter.isExclude ? 'active' : ''"
            title="排除"
            @click="parameter.isExclude = !parameter.isExclude"
          />
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
    const searchResultList = ref<Array<IRipgrepSearchResult>>([]);
    const onSearch = async (newValue?: string) => {
      keyword.value = newValue ?? keyword.value;

      if (!keyword.value) {
        return;
      }

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

.browser-view {
  .search-widget {
    .widget-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .unitext-icon {
        width: 20px;
        height: 20px;
        line-height: 20px;

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
</style>
