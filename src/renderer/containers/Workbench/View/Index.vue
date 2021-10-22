<template>
  <section
    id="markdown-preview"
    ref="md"
    class="line-numbers match-braces rainbow-braces"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue-demi";

interface IProps {
  md: HTMLElement | null;
}

export default defineComponent({
  name: "ViewMarkdown",

  components: {},

  props: {
    src: { type: Object, require: true },
  },

  data() {
    return {
      md: null,
    } as IProps;
  },

  methods: {
    onChange() {},

    onScroll() {},

    mounted() {},

    beforeDestroy() {},
  },
});
</script>

<style lang="less" scoped>
#markdown-preview {
  height: 100%;
  overflow: auto;
  padding: 2em;
  background-color: #fafafa;
  font-family: @normal-font-family;
  font-size: @preview-font-size;
}
</style>
