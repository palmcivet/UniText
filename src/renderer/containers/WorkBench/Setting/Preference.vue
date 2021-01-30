<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import schema from "@/main/config/preference.json";
import Range from "@/renderer/components/Form/Range.vue";
import Group from "@/renderer/components/Form/Group.vue";
import Boolean from "@/renderer/components/Form/Boolean.vue";

@Component({
  name: "Preference",
  components: {
    Group,
    Range,
    Boolean,
  },
})
export default class Preference extends Vue {
  created() {}
}
</script>

<style lang="less" scoped></style>
