<template>
  <div class="option" :title="prop.description">
    <label>{{ $g(prop.title) }}</label>

    <li v-for="(v, i) in res" :key="i">
      <div class="text-item" v-if="lock === i">
        <i class="ri-close-line" @click="onCancel()" @keydown.stop.esc="onCancel()" />
        <i class="ri-check-line" @click="onModify()" />
        <input type="text" v-model.trim="newVal" @keydown.stop.enter="onModify()" />
      </div>

      <div class="text-item unedit" v-else>
        <i class="ri-pencil-line" @click="onEdit(i, v)" />
        <i class="ri-delete-bin-4-line" @click="onDelete(i)" />
        <div>{{ v }}</div>
      </div>
    </li>

    <li class="text-item" :style="{ marginTop: '5px' }">
      <i class="ri-play-list-add-line" :style="{ margin: '0.8em' }" @click="onAdd()" />
      <input type="text" v-model.trim="addVal" />
    </li>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Skeleton from "./skeleton";

export default defineComponent({
  name: "TextGroup",

  mixins: [Skeleton],

  data() {
    return {
      lock: -1,
      newVal: "",
      addVal: "",
      res: this.value as Array<string>,
    };
  },

  methods: {
    onModify() {
      if (this.newVal === "") {
        return;
      }

      this.res[this.lock] = this.newVal;
      this.handleSubmit();

      this.lock = -1;
      this.newVal = "";
    },

    onEdit(idx: number, old: string) {
      this.newVal = old;
      this.lock = idx;
    },

    onCancel() {
      this.lock = -1;
    },

    onDelete(idx: number) {
      this.res.splice(idx, 1);
      this.handleSubmit();
    },

    onAdd() {
      if (this.addVal === "") {
        return;
      }

      this.res.push(this.addVal);
      this.handleSubmit();

      this.addVal = "";
    },

    handleSubmit() {
      this.$emit("u-change", this.res);
    },
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

li {
  display: block;
  list-style: none;
  max-width: @input-width;
  padding-left: 10px;
  font-family: var(--normal-font-family);
}

.text-item {
  display: flex;
  height: @input-height;
  align-items: center;
  flex-direction: row-reverse;

  input,
  div {
    width: 100%;
    font-size: 1em;
  }

  i {
    cursor: pointer;
    font-size: 1.2em;
    padding: 0 5px;
  }
}

div.text-item.unedit {
  padding-left: 2px;

  &:hover {
    color: var(--u-form-hover-fg);
    background-color: var(--u-form-hover-bg);
  }
}
</style>
