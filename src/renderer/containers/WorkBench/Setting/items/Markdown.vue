<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <GroupCreator
      v-for="(v, k, i) of schema"
      :id="k"
      :key="i"
      :userData="userData"
      :properties="v"
      :field="k"
      @submit="handleSubmit($event)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { debounce } from "@/shared/utils";
import { schemaMarkdown } from "@/shared/setting/markdown";
import GroupCreator from "../widgets/GroupCreator.vue";

@Component({
  name: "Markdown",
  components: { GroupCreator },
})
export default class Markdown extends Vue {
  schema = schemaMarkdown;

  userData: any;

  data() {
    return {
      userData: {},
    };
  }

  setVal(g: string, f: string, v: any) {
    this.userData[g][f] = v;
  }

  handleSubmit = debounce((val: [string, string, any]) => {
    const [g, f, v] = val;
    this.setVal(g, f, v);
    this.$markdown.setItem(`${g}.${f}`, v);
  });

  created() {
    this.userData = this.$markdown.getAll();
  }
}
</script>

<style lang="less" scoped></style>
