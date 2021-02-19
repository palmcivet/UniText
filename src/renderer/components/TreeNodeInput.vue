<template>
  <div v-if="!isEdit" @keydown.enter="handleRename()">
    {{ titleTrimmer(itemName) }}
  </div>
  <div v-else @keydown.enter="handleRename()">
    <input
      ref="input"
      v-model="newName"
      @click.stop="noop()"
      @keydown="handleSubmit($event)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "TreeNodeInput" })
export default class TreeNodeInput extends Vue {
  @Prop({ type: String, required: true, default: "" })
  itemName!: string;

  @Prop({ type: Function })
  titleTrimmer!: (val: string) => string;

  @Prop({ type: Function })
  titleValidator!: (val: string) => boolean;

  newName = "";

  isEdit = false;

  noop() {}

  handleRename() {
    this.isEdit = true;
    this.$nextTick(() => {
      (this.$refs.input as HTMLElement).focus();
    });
  }

  handleSubmit(e: KeyboardEvent) {
    e.stopPropagation();

    switch (e.key) {
      case "Escape":
        this.isEdit = false;
        break;
      case "Enter":
        this.isEdit = false;
        if (!this.titleValidator(this.newName)) {
          this.$emit("change", this.newName.trim());
        }
        break;
      default:
        break;
    }
  }
}
</script>

<style lang="less" scoped></style>
