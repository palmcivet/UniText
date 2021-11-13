<template>
  <Main />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "@/renderer/pages/Main.vue";

export default defineComponent({
  name: "Index",

  components: {
    Main,
  },

  props: {},
});
</script>
