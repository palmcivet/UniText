<template>
  <div class="info-card" :title="`${remark}: ${raw}`">
    <div>
      <span class="major">{{ num }}</span>
      <span class="minor">{{ sufix }}</span>
    </div>
    <span class="remark">{{ remark }}</span>
  </div>
</template>

<script lang="ts" scoped>
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  name: "InfoCardNormal",

  props: {
    raw: { type: Number, default: 0 },
    remark: { type: String },
  },

  setup(props) {
    const sufix = ref("");

    const num = computed(() => {
      const val = props.raw as number;

      if (val < 1000) {
        sufix.value = "";
        return `${val}`;
      } else if (val < 1000000) {
        sufix.value = "k";
        if (val % 1000 === 0) {
          return `${val / 1000}`;
        } else {
          return `${(val / 1000).toFixed(1)}`;
        }
      } else if (val < 1000000000) {
        sufix.value = "m";
        if (val % 1000000 === 0) {
          return `${val / 1000000}`;
        } else {
          return `${(val / 1000000).toFixed(1)}`;
        }
      } else if (val < 1000000000000) {
        sufix.value = "g";
        if (val % 1000000000 === 0) {
          return `${val / 1000000000}`;
        } else {
          return `${(val / 1000000000).toFixed(1)}`;
        }
      } else {
        sufix.value = "";
        return "Many";
      }
    });

    return {
      sufix,
      num,
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
