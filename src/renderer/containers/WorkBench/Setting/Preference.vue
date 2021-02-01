<template>
  <div class="preference">
    <Group :properties="data.system"></Group>
    <Group :properties="data.appearance"></Group>
    <Group :properties="data.fileManager"></Group>
    <Group :properties="data.editor"></Group>
    <Group :properties="data.document"></Group>
    <Group :properties="data.markdown"></Group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { schemaPreference } from "@/main/config/schemaPreference";
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
