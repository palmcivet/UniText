<template>
  <keep-alive v-if="panelStyle === 'SIDE'">
    <component :is="panelType"></component>
  </keep-alive>
  <keep-alive v-else>
    <component :is="panelType"></component>
  </keep-alive>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import TOC from "@/component/Panel/Toc/Index.vue";
import INFO from "@/component/Panel/Info/Index.vue";
import EXPORT from "@/component/Panel/Export/Index.vue";
import { EPanelType, EPanelStyle } from "@/interface/vuex/general";

@Component({
  name: "Panel",
  components: {
    TOC,
    INFO,
    EXPORT,
  },
})
export default class Panel extends Vue {
  panelType: EPanelType = EPanelType.TOC;
  panelStyle: EPanelStyle = EPanelStyle.FLOAT;
}
</script>

<style lang="less" scoped></style>
