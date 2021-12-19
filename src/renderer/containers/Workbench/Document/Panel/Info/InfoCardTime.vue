<template>
  <div class="info-card" :title="`${remark}: ${raw}`">
    <div>
      <span class="major">{{ time }}</span>
      <span class="minor">{{ sufix }}</span>
    </div>
    <span class="remark">{{ remark }}</span>
  </div>
</template>

<script lang="ts" scoped>
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  name: "InfoCardTime",

  props: {
    raw: { type: Number, default: 0 },
    remark: { type: String },
  },

  setup(props) {
    const sufix = ref("");

    const time = computed(() => {
      const val = props.raw;

      if (val < 60) {
        sufix.value = "s";
        return `${val}`;
      } else if (val < 3600) {
        sufix.value = "m";
        if (val % 60 === 0) {
          return `${val / 60}`;
        } else {
          return `${(val / 60).toFixed(1)}`;
        }
      } else if (val < 86400) {
        sufix.value = "h";
        if (val % 3600 === 0) {
          return `${val / 3600}`;
        } else {
          return `${(val / 3600).toFixed(1)}`;
        }
      } else if (val < 604800) {
        sufix.value = "d";
        if (val % 86400 === 0) {
          return `${val / 86400}`;
        } else {
          return `${(val / 86400).toFixed(1)}`;
        }
      } else {
        sufix.value = "w";
        return `${(val / 604800).toFixed(1)}`;
      }
    });

    return {
      sufix,
      time,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
