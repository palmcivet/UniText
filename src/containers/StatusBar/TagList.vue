<template>
  <ol>
    <li v-for="(tag, idx) in tagGroup" :key="idx" :title="tag">
      <!-- <i class="ri-hashtag"></i> -->
      # {{ tag }}
    </li>
    <li title="增加标签"><i class="ri-add-line" /></li>
  </ol>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "TagList",
  components: {},
})
export default class TagList extends Vue {
  tagGroup = ["Markdown", "Rust"];
}
</script>

<style lang="less" scoped></style>
