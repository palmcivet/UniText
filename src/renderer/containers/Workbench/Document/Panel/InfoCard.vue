<template>
  <section :title="`${remark}: ${raw}`">
    <div v-if="type === 'DATE' && isCN">
      <span class="major">{{ raw.slice(5, 7) }}</span>
      <span>{{ "月 " }}</span>
      <span class="major">{{ raw.slice(8, 10) }}</span>
      <span>{{ "日 " }}</span>
      <span class="minor">{{ raw.slice(11, 16) }}</span>
    </div>
    <div v-else-if="type === 'DATE' && !isCN">
      <span class="major">{{ raw.slice(8, 10) }}</span>
      <span>{{ ` ${monthMap[parseInt(date.slice(5, 7))]} ` }}</span>
      <span class="minor">{{ raw.slice(12, 16) }}</span>
    </div>

    <div v-else-if="type === 'TIME'">
      <span class="major">{{ time }}</span>
      <span class="minor">{{ sufix }}</span>
    </div>

    <div v-else>
      <span class="major">{{ num }}</span>
      <span class="minor">{{ sufix }}</span>
    </div>

    <span class="remark">{{ remark }}</span>
  </section>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({ name: "InfoCard" })
export default class InfoCard extends Vue {
  @Prop({ type: [String, Number] })
  raw!: string | number;

  @Prop({ type: String })
  type!: "DATE" | "TIME" | "NUM";

  @Prop({ type: String })
  remark!: string;

  @Prop({ type: Boolean })
  isCN!: boolean;

  sufix!: string;

  monthMap = [
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

  get num() {
    const val = this.raw as number;

    if (val < 1000) {
      this.sufix = "";
      return `${val}`;
    } else if (val < 1000000) {
      this.sufix = "k";
      if (val % 1000 === 0) {
        return `${val / 1000}`;
      } else {
        return `${(val / 1000).toFixed(1)}`;
      }
    } else if (val < 1000000000) {
      this.sufix = "m";
      if (val % 1000000 === 0) {
        return `${val / 1000000}`;
      } else {
        return `${(val / 1000000).toFixed(1)}`;
      }
    } else {
      this.sufix = "";
      return "Many";
    }
  }

  get time() {
    const val = this.raw as number;

    if (val < 60) {
      this.sufix = "s";
      return `${val}`;
    } else if (val < 3600) {
      this.sufix = "m";
      if (val % 60 === 0) {
        return `${val / 60}`;
      } else {
        return `${(val / 60).toFixed(1)}`;
      }
    } else if (val < 86400) {
      this.sufix = "h";
      if (val % 3600 === 0) {
        return `${val / 3600}`;
      } else {
        return `${(val / 3600).toFixed(1)}`;
      }
    } else if (val < 604800) {
      this.sufix = "d";
      if (val % 86400 === 0) {
        return `${val / 86400}`;
      } else {
        return `${(val / 86400).toFixed(1)}`;
      }
    } else {
      this.sufix = "weeks ago";
      return `${val / 604800}`;
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

section {
  padding: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  user-select: none;

  span {
    font-size: @span-common;
  }

  .major {
    font-size: @span-major;
    font-weight: bold;
  }

  .minor {
    font-size: @span-minor;
  }

  .remark {
    font-size: @span-remark;
  }
}
</style>
