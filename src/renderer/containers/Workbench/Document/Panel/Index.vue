<template>
  <div class="panel">
    <template v-for="(com, index) in panelList" :key="index">
      <div class="panel-title" @click="onTogglePanel(index)">
        <i
          class="panel-title-icon"
          :class="activePanel !== com ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'"
        />
        <div class="panel-title-text">{{ com.toUpperCase() }}</div>
      </div>
      <div class="panel-wrapper" :style="activePanel !== com ? { height: '0' } : {}">
        <component :is="com" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Toc from "./Toc/Index.vue";
import Info from "./Info/Index.vue";
import Export from "./Export/Index.vue";

export default defineComponent({
  name: "Panel",

  components: {
    Toc,
    Info,
    Export,
  },

  setup() {
    const panelList = [Toc.name, Info.name, Export.name];
    const panelListLength = panelList.length;

    const activePanel = ref(panelList[2]);

    const onTogglePanel = (index: number) => {
      let targetPane = panelList[index];

      /* 关闭当前 panel，打开下一个 panel */
      if (targetPane === activePanel.value) {
        targetPane = panelList[(index + 1) % panelListLength];
      }

      activePanel.value = targetPane;
    };

    return {
      panelList,
      panelListLength,
      activePanel,

      onTogglePanel,
    };
  },
});
</script>

<style lang="less" scoped>
.panel {
  height: 100%;
  overflow-y: auto;

  @title-height: 22px;

  &-title {
    height: @title-height;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;

    &-icon {
      font-size: 16px;
    }

    &-text {
      margin-left: 4px;
    }
  }

  &-wrapper {
    height: calc(100% - v-bind(panelListLength) * @title-height);
    transition: height 0.3s ease-in-out;
  }
}
</style>
