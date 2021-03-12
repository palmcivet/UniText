<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <GroupCreator
      v-for="(v, k, i) of schema"
      :id="k"
      :key="i"
      :field="k"
      :userData="userData"
      :properties="v"
      @submit="handleSubmit($event)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { debounce } from "@/common/utils";
import { schemaPreference } from "@/common/schema/sPreference";
import GroupCreator from "../widgets/GroupCreator.vue";

@Component({
  name: "Preference",
  components: { GroupCreator },
})
export default class Preference extends Vue {
  schema = schemaPreference;

  userData: any;

  data() {
    return {
      userData: this.$preference.getAll(),
    };
  }

  setVal(g: string, f: string, v: any) {
    this.userData[g][f] = v;
  }

  handleSubmit = debounce((val: [string, string, any]) => {
    const [g, f, v] = val;
    this.setVal(g, f, v);
    this.$preference.setItem(`${g}.${f}`, v);
  });
}
</script>

<style lang="less" scoped></style>
