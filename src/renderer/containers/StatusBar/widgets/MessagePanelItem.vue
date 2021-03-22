<template>
  <details :open="isOpen" @click.prevent="isOpen = !isOpen">
    <summary>
      {{ msg.title }}
      <i @click="$emit('close')" class="ri-close-line" />
    </summary>
    {{ msg.body }}
  </details>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import { INotificationMessage } from "@/typings/vuex/notification";

@Component({
  name: "MessagePanelItem",
})
export default class MessagePanelItem extends Vue {
  @Prop({ type: Object, required: true })
  msg!: INotificationMessage;

  @Prop({ type: Function })
  confirm?: () => void;

  @Prop({ type: Function })
  cancel?: () => void;

  isOpen = false;
}
</script>

<style lang="less" scoped>
details {
  margin: 3px;
  padding: 3px;
  cursor: pointer;

  &:hover {
    background: #3b3f47; // DEV
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
}
</style>
