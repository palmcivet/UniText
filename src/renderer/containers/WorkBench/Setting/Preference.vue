<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }">
    <Group
      v-for="(v, k, i) of schema"
      :id="k"
      :key="i"
      :userData="userData"
      :properties="v"
      :field="k"
      @item-submit="handleSubmit($event)"
    />
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";

import { debounce } from "@/common/utils";
import { IPC_PREFERENCE } from "@/common/channel/ipc";
import { schemaPreference } from "@/main/schema/sPreference";
import Group from "@/renderer/components/Form/Group.vue";

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
