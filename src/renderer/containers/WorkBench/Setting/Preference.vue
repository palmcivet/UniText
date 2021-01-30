<template>
  <div class="preference">
    <Group :properties="properties"></Group>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { schema } from "@/main/config/preference";
import Group from "@/renderer/components/Form/Group.vue";

@Component({
  name: "Preference",
  components: { Group },
})
export default class Preference extends Vue {
  data = schema.system;

  get properties() {
    return this.data;
  }
}
</script>

<style lang="less" scoped></style>
