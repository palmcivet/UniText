<template>
  <div class="message-panel">
    <div class="toolbar">
      <div>{{ hasMessage ? "新消息" : "无新消息" }}</div>
      <div class="title">
        <i @click="CLEAR_ALL()" class="ri-chat-delete-line" />
        <i @click="CLOSE_PANEL()" class="ri-arrow-down-s-line" />
      </div>
    </div>
    <div>
      <MessagePanelItem
        v-for="(v, k) in messageQueue"
        :key="k"
        :msg="v"
        @close="CLEAR_MESSAGE(k)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import MessagePanelItem from "./MessagePanelItem.vue";
import { INotificationMessage, INotificationState } from "@/typings/vuex/notification";

const notification = namespace("notification");

@Component({
  name: "MessagePanel",
  components: {
    MessagePanelItem,
  },
})
export default class MessagePanel extends Vue {
  @notification.State((state: INotificationState) => state.messageQueue)
  messageQueue!: Array<INotificationMessage>;

  @notification.Getter("hasMessage")
  hasMessage!: boolean;

  @notification.Mutation("CLEAR_MESSAGE")
  CLEAR_MESSAGE!: (idx: number) => void;

  @notification.Mutation("CLEAR_ALL")
  CLEAR_ALL!: () => void;

  @notification.Mutation("CLOSE_PANEL")
  CLOSE_PANEL!: () => void;
}
</script>

<style lang="less" scoped>
@gap: 5px;

i {
  font-size: 1.2em;
  line-height: 21px;
  margin: 0 @gap;
  cursor: pointer;
}

.message-panel {
  color: var(--sidePanel-Fg);
  background: var(--sidePanel-Bg);

  .toolbar {
    display: flex;
    justify-content: space-between;
    background: #33373f; // DEV
    padding: @gap;
    user-select: none;

    .title {
      display: flex;
      align-content: space-between;
      justify-content: center;
    }
  }
}
</style>
