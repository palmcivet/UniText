<template>
  <div class="info-card" :title="`${remark}: ${time}`">
    <div v-if="isCN">
      <span class="major">{{ time.slice(5, 7) }}</span>
      <span>{{ "月 " }}</span>
      <span class="major">{{ time.slice(8, 10) }}</span>
      <span>{{ "日 " }}</span>
      <span class="minor">{{ time.slice(11, 16) }}</span>
    </div>

    <div v-else>
      <span class="major">{{ time.slice(8, 10) }}</span>
      <span>{{ ` ${monthMap[parseInt(date.slice(5, 7))]} ` }}</span>
      <span class="minor">{{ time.slice(12, 16) }}</span>
    </div>

    <span class="remark">{{ remark }}</span>
  </div>
</template>

<script lang="ts" scoped>
import { computed, defineComponent } from "vue";

const monthMap = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Spt",
  "Oct",
  "Nov",
  "Dec",
];

export default defineComponent({
  name: "InfoCardDate",

  props: {
    raw: { type: Number, default: new Date().getTime() },
    remark: { type: String },
    isCN: { type: Boolean },
  },

  setup(props) {
    return {
      monthMap,
      time: computed(() => new Date(props.raw).toJSON()),
    };
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
