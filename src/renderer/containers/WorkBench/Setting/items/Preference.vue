<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <Group
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
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";

import { debounce } from "@/common/utils";
import { IPC_PREFERENCE } from "@/common/channel/ipc";
import { schemaPreference } from "@/common/schema/sPreference";
import Group from "../widgets/Group.vue";

@Component({
  name: "Preference",
  components: { Group },
})
export default class Preference extends Vue {
  schema = schemaPreference;

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
    ipcRenderer.send(IPC_PREFERENCE.SET_ITEM, `${g}.${f}`, v);
  }, 200);

  created() {
    this.userData = ipcRenderer.sendSync(IPC_PREFERENCE.GET_ALL_SYNC);
  }
}
</script>

<style lang="less" scoped></style>
