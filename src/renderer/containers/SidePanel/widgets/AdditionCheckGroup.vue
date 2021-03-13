<template>
  <div>
    <label v-for="(v, k) in main" :key="k" :title="v.title" @change="handleCheck(k)">
      <input type="checkbox" :checked="v.check" />
      {{ v.label }}
    </label>

    <label>
      <input
        type="checkbox"
        :disabled="!addi.check"
        :checked="addi.check"
        @change="handleCheck()"
      />
      <select v-model="chosen" @change="handleCheck()">
        <option selected disabled hidden>{{ addi.label }}</option>
        <option v-for="(v, i) in addi.data" :value="v" :key="i">{{ v }}</option>
      </select>
    </label>
  </div>
</template>

<script lang="ts">
import UCheckBox from "@/renderer/components/Form/UCheckBox.vue";
import { Vue, Component, Prop, Emit } from "vue-property-decorator";

interface ICheckGroup {
  main: Array<{
    id: number;
    label: string;
    title: string;
    check: boolean;
  }>;
  addi: {
    id: number;
    label: string;
    title: string;
    check: boolean;
    data: Array<string>;
  };
}

@Component({
  name: "AdditionCheckGroup",
  components: {
    UCheckBox,
  },
})
export default class AdditionCheckGroup extends Vue {
  @Prop({ type: Object, required: true })
  data!: ICheckGroup;

  get main() {
    return this.data.main;
  }

  get addi() {
    return this.data.addi;
  }

  get chosen() {
    return this.addi.label;
  }

  @Emit("change")
  handleCheck(idx: number) {
    const tmp: Array<{ id: number; val: string }> = [];

    if (idx) {
      this.main[idx].check = !this.main[idx].check;
    } else {
      this.addi.check = true;
    }

    this.main.forEach((item) => {
      if (item.check) {
        tmp.push({ id: item.id, val: item.label });
      }
    });

    if (this.chosen !== this.addi.label) {
      return [...tmp, { id: this.addi.id, val: this.chosen }];
    } else {
      return tmp;
    }
  }
}
</script>

<style lang="less" scoped>
div {
  display: flex;
  flex-direction: column;

  label {
    padding-left: 10%;
    margin-top: 4px;
    cursor: pointer;

    select {
      color: var(--inputBox-Fg);
      background: var(--inputBox-Bg);
    }
  }
}
</style>
