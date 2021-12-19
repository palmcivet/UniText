<template>
  <SplitView :showLeft="true" :showRight="showPanel" :threshold="[21 / 31, 25 / 31]">
    <template #left>
      <div class="wrapper">
        <SplitView
          :showLeft="!readMode"
          :showRight="showDbColumn"
          :initWidth="1 / 2"
          :threshold="[1 / 3, 2 / 3]"
        >
          <template #left>
            <EditorSource class="wrapper" />
          </template>
          <template #right>
            <ViewerMarkdown class="wrapper" />
          </template>
        </SplitView>
      </div>
    </template>
    <template #right>
      <div class="wrapper">
        <Panel />
      </div>
    </template>
  </SplitView>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import useGeneral from "@/renderer/stores/general";
import SplitView from "@/renderer/components/SplitView/Index.vue";
import EditorSource from "./Editor/Monaco/Index.vue";
import ViewerMarkdown from "./Viewer/Markdown/Index.vue";
import Panel from "./Panel/Index.vue";

export default defineComponent({
  name: "Editor",

  components: {
    Panel,
    SplitView,
    EditorSource,
    ViewerMarkdown,
  },

  setup() {
    const general = useGeneral();

    const readMode = computed(() => {
      return general.$state.interface.readMode;
    });

    const showPanel = computed(() => {
      return general.$state.interface.showPanel;
    });

    const showDbColumn = computed(() => {
      return general.$state.interface.dbColumn;
    });

    const icon = computed(() => {
      return showPanel.value ? "ri-arrow-drop-right-line" : "ri-arrow-drop-left-line";
    });

    return {
      icon,
      readMode,
      showPanel,
      showDbColumn,
    };
  },
});
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
