<template>
  <details :open="!collapse">
    <summary @click.prevent="handleToggle()">
      <i :class="collapse ? 'ri-arrow-right-s-line' : 'ri-arrow-down-s-line'" />
      <div>{{ nodeName }}</div>
    </summary>
    <div><slot /></div>
  </details>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "ListNode",
})
export default class ListNode extends Vue {
  @Prop({ type: String, required: true })
  nodeName!: string;

  collapse = false;

  handleToggle() {
    this.collapse = !this.collapse;
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

details {
  > summary {
    display: flex;
    cursor: pointer;

    i,
    div {
      line-height: 1.5em;
    }
  }

  > div {
    margin-left: 1em;

    > * {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      font-family: @normal-font-family;

      // DEV 来自 FileTreeNode
      user-select: none;
      height: 1.5em;
      line-height: 1.5em;

      &:hover {
        color: var(--sideBarItem-hoverFg);
        background: var(--sideBarItem-hoverBg);
      }
    }
  }
}
</style>
