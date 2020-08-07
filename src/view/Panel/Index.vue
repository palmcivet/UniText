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

@Component({
  name: "Panel",
  components: { Toc },
})
export default class Pannel extends Vue {
  activePannel = "Toc";
}
</script>

<style lang="less" scoped></style>
