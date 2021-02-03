<template>
  <div>
    <Group v-for="(v, k, i) of data" :key="i" :properties="v" :field="k" :id="k" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { schemaPreference } from "@/main/schema/sPreference";
import Group from "@/renderer/components/Form/Group.vue";

@Component({
  name: "Preference",
  components: { Group },
})
export default class Preference extends Vue {
  data = schemaPreference;
}
</script>

<style lang="less" scoped></style>
