<template>
  <div>
    <div class="code">
      <span>{{ group }}</span>
      <span>.</span>
      <span>{{ field }}</span>
    </div>
    <div class="option" :title="properties.description">
      <label :style="{ marginBottom: '5px' }">{{ $g(properties.title) }}</label>

      <li v-for="(v, i) in res" :key="i">
        <div v-if="lock === i" class="text-item">
          <i
            class="ri-close-line"
            @click="handleCancel()"
            @keydown.stop.esc="handleCancel()"
          />
          <i class="ri-check-line" @click="handleModify()" />
          <input type="text" v-model.trim="newVal" @keydown.stop.enter="handleModify()" />
        </div>
        <div v-else class="text-item unedit" :style="{ paddingLeft: '2px' }">
          <i class="ri-pencil-line" @click="handleEdit(i, v)" />
          <i class="ri-delete-bin-4-line" @click="handleDelete(i)" />
          <div>{{ v }}</div>
        </div>
      </li>
      <li class="text-item" :style="{ marginTop: '5px' }">
        <i
          class="ri-play-list-add-line"
          @click="handleAdd()"
          :style="{ margin: '0.8em' }"
        />
        <input type="text" v-model.trim="addVal" />
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TextGroup" })
export default class TextGroup extends Vue {
  @Prop({ type: Object, required: true })
  properties!: any;

  @Prop({ type: String, required: true })
  group!: string;

  @Prop({ type: String, required: true })
  field!: string;

  @Prop({ type: Array, default: false })
  val!: Array<string>;

  res = this.val;

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
    this.$emit("item-change", [this.group, this.field, this.res]);
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";

li {
  list-style: none;
}

.text-item {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;

  input,
  div {
    width: 100%;
  }

  i {
    cursor: pointer;
    font-size: 1.2em;
    padding: 0 5px;
  }
}

div.text-item.unedit:hover {
  background: var(--formGroupTitle-Bg);
}
</style>
