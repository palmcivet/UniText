<template>
  <div :style="{ paddingLeft: '14%', paddingRight: '14%' }" v-if="shouldRender">
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
import { ipcRenderer } from "electron";
import { Vue, Component } from "vue-property-decorator";

import { debounce } from "@/common/utils";
import { IPC_PREFERENCE } from "@/common/channel/ipc";
import { schemaSystem } from "@/common/schema/sSystem";
import GroupCreator from "../widgets/GroupCreator.vue";

@Component({
  name: "System",
  components: { GroupCreator },
})
export default class System extends Vue {
  schema = schemaSystem;

  userData: any;

  shouldRender = false;

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
  });

  beforeCreate() {
    ipcRenderer.once(IPC_PREFERENCE.GET_ALL_REPLY, (e, data: any) => {
      this.userData = data;
      this.shouldRender = true;
    });

    ipcRenderer.send(IPC_PREFERENCE.GET_ALL);
  }
}
</script>

<style lang="less" scoped></style>
