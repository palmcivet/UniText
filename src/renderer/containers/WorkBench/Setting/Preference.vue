<template>
  <div>
    <Group
      v-for="(v, k, i) of schema"
      :id="k"
      :key="i"
      :userData="userData"
      :properties="v"
      :field="k"
    />
  </div>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

import { schemaPreference } from "@/main/schema/sPreference";
import Group from "@/renderer/components/Form/Group.vue";
import { IGeneralState } from "@/typings/vuex/general";

const general = namespace("general");

@Component({
  name: "Preference",
  components: { Group },
})
export default class Preference extends Vue {
  @general.State((state: IGeneralState) => state)
  userData!: IGeneralState;

  schema = schemaPreference;
}
</script>

<style lang="less" scoped></style>
