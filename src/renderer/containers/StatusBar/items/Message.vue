<template>
  <CheckItem
    :itemGroup="iconStatus"
    :condition="showMessage ? 'true' : 'false'"
    @click="CLOSE_PANEL()"
  />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { namespace } from "vuex-class";

import CheckItem from "../widgets/CheckItem.vue";
import { INotificationState } from "@/typings/vuex/notification";

const notification = namespace("notification");

@Component({
  name: "Message",
  components: {
    CheckItem,
  },
})
export default class Message extends Vue {
  @notification.State((state: INotificationState) => state.showMessage)
  showMessage!: boolean;

  @notification.Getter("hasMessage")
  hasMessage!: boolean;

  @notification.Mutation("CLOSE_PANEL")
  CLOSE_PANEL!: boolean;

  get icon() {
    return this.hasMessage ? "ri-notification-2-fill" : "ri-notification-2-line";
  }

  // DEV i18n
  get iconStatus() {
    return {
      true: { icon: this.icon, title: "无消息" },
      false: { icon: this.icon, title: "有消息" },
    };
  }
}
</script>

<style lang="less" scoped></style>
