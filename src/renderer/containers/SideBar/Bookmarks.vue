<template>
  <BaseView>
    <template slot="view-title">
      <span>{{ $t("sidebar.bookmarks") }}</span>
    </template>

    <template slot="view"></template>
  </BaseView>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import BaseView from "./BaseView.vue";

@Component({
  name: "Bookmarks",
  components: {
    BaseView,
  },
})
export default class Bookmarks extends Vue {}
</script>

<style lang="less" scoped></style>
