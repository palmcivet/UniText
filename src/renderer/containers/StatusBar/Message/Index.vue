<template>
  <li>
    <i :class="icon"></i>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Message",

  components: {},

  setup() {
    const icon = computed(() => {
      return false ? "ri-notification-2-fill" : "ri-notification-2-line";
    });

    return {
      icon,
    };
  },
});
</script>

<style lang="less" scoped></style>
