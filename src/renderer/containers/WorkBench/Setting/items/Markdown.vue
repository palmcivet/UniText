<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <Group
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
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";

import { debounce } from "@/common/utils";
import { schemaMarkdown } from "@/common/schema/sMarkdown";
import Group from "../widgets/Group.vue";

@Component({
  name: "Markdown",
  components: { Group },
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
    // TODO 完善 IPC Channel
    ipcRenderer.send("", `${g}.${f}`, v);
  }, 200);

  created() {}
}
</script>

<style lang="less" scoped></style>
