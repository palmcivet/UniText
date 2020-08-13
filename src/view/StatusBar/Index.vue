<template>
  <article>
    <div>
      <!-- 同步状态 -->
    </div>
    <ul>
      <li><i class="ri-layout-column-fill"></i></li>
      <li><i class="ri-code-s-slash-fill"></i></li>
      <li><i class="ri-text"></i></li>
    </ul>
    <i class="ri-side-bar-line"></i>
    <i class="ri-notification-2-line"></i>
  </article>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "StatusBar",
  components: {},
})
export default class StatusBar extends Vue {}
</script>

<style lang="less" scoped>
article {
  display: flex;

  > ul {
    display: flex;
  }
}
</style>
