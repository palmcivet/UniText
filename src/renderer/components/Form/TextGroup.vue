<template>
  <div>
    <div class="code">
      <span>{{ group }}</span>
      <span>.</span>
      <span>{{ field }}</span>
    </div>
    <div class="option" :title="properties.description">
      <label>{{ $g(properties.title) }}</label>
      <li v-for="(v, i) in val" :key="i">{{ v }}</li>
      <div v-if="!isAddItem" @click="isAddItem = true">添加</div>
      <div v-else>
        <input type="text" />
        <button @click="handleSubmit()">确定</button>
        <button @click="isAddItem = false">取消</button>
      </div>
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

  isAddItem = false;

  handleSubmit() {
    this.isAddItem = false;
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
