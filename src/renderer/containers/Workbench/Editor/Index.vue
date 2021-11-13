<template>
  <EditorSource />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditorSource from "./EditorSource.vue";

export default defineComponent({
  name: "Editor",

  components: {
    EditorSource,
  },

  setup() {},
});
</script>
