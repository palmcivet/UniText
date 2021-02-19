<template>
  <BaseView>
    <template slot="view-title">
      <span>{{ $t("sidebar.tags") }}</span>
    </template>

    <template slot="view"></template>
  </BaseView>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import BaseView from "../widgets/BaseView.vue";

@Component({
  name: "Tags",
  components: {
    BaseView,
  },
})
export default class Tags extends Vue {}
</script>

<style lang="less" scoped></style>
