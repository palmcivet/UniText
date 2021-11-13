<template>
  <CheckItem
    :itemGroup="styleList"
    :condition="panelFloat ? 'true' : 'false'"
    @click="handleClick()"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import useGeneral from "@/renderer/stores/general";
import CheckItem from "../widgets/CheckItem.vue";

export default defineComponent({
  name: "PanelStyle",

  components: {
    CheckItem,
  },

  setup() {
    const general = useGeneral();

    const styleList = computed(() => {
      return {
        false: {
          title: "侧边栏",
          icon: "ri-side-bar-line",
        },
        true: {
          title: "浮动面板",
          icon: "ri-discuss-line",
        },
      };
    });

    const handleClick = () => {
      this.TOGGLE_PANEL_STYLE();
      this.$layout.togglePart("PANEL");
    };

    return {
      styleList,
      panelFloat: general.interface.panelFloat,
      TOGGLE_PANEL_STYLE: general.TOGGLE_PANEL_STYLE,
      handleClick,
    };
  },
});
</script>

<style lang="less" scoped></style>
