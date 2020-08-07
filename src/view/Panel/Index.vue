<template>
  <article>
    <keep-alive>
      <component :is="activePannel"></component>
    </keep-alive>
  </article>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import Toc from "@/view/Panel/Toc/Index.vue";
import Info from "@/view/Panel/Info/Index.vue";
import Export from "@/view/Panel/Export/Index.vue";

@Component({
  name: "Panel",
  components: {
    Toc,
    Info,
    Export,
  },
})
export default class Pannel extends Vue {
  activePannel = "Toc";
}
</script>

<style lang="less" scoped>
article {
  width: calc(100% - 1px);
  height: 100%;
}
</style>
