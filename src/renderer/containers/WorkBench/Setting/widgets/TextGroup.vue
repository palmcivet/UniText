<template>
  <div class="option" :title="prop.description">
    <label>{{ $g(prop.title) }}</label>

    <li v-for="(v, i) in res" :key="i">
      <div class="text-item" v-if="lock === i">
        <i
          class="ri-close-line"
          @click="handleCancel()"
          @keydown.stop.esc="handleCancel()"
        />
        <i class="ri-check-line" @click="handleModify()" />
        <input type="text" v-model.trim="newVal" @keydown.stop.enter="handleModify()" />
      </div>

      <div class="text-item unedit" v-else>
        <i class="ri-pencil-line" @click="handleEdit(i, v)" />
        <i class="ri-delete-bin-4-line" @click="handleDelete(i)" />
        <div>{{ v }}</div>
      </div>
    </li>

    <li class="text-item" :style="{ marginTop: '5px' }">
      <i
        class="ri-play-list-add-line"
        :style="{ margin: '0.8em' }"
        @click="handleAdd()"
      />
      <input type="text" v-model.trim="addVal" />
    </li>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TextGroup" })
export default class TextGroup extends Vue {
  @Prop({ type: Object, required: true })
  prop!: any;

  @Prop({ type: Array, default: false })
  value!: Array<string>;

  res!: Array<string>;

  data() {
    return {
      res: this.value,
    };
  }

  lock = -1;

  newVal = "";

  addVal = "";

  handleModify() {
    if (this.newVal === "") return;

    this.res[this.lock] = this.newVal;
    this.handleSubmit();

    this.lock = -1;
    this.newVal = "";
  }

  handleEdit(idx: number, old: string) {
    this.newVal = old;
    this.lock = idx;
  }

  handleCancel() {
    this.lock = -1;
  }

  handleDelete(idx: number) {
    this.res.splice(idx, 1);
    this.handleSubmit();
  }

  handleAdd() {
    if (this.addVal === "") return;

    this.res.push(this.addVal);
    this.handleSubmit();

    this.addVal = "";
  }

  handleSubmit() {
    this.$emit("change", this.res);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/components/Form/style.less";

li {
  display: block;
  list-style: none;
  max-width: @input-width;
  padding-left: 10px;
  font-family: @normal-font-family;
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
    background: var(--formGroupTitle-Bg);
  }
}
</style>
