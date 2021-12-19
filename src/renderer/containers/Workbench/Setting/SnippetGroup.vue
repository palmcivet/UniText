<template>
  <div class="snippet-group" v-for="(properties, key, index) of schema" :key="index">
    <div class="group-h2" :id="key">
      <div class="group-title">{{ $g(properties.title) }}</div>
      <div class="group-description">{{ $g(properties.description) }}</div>
    </div>

    <div class="group-option">
      <li class="snippet-table table-head">
        <div class="cell col-1">触发字符</div>
        <div class="cell col-2">快捷键</div>
        <div class="cell col-3">说明</div>
      </li>

      <li class="snippet-table" v-if="userData[key].length === 0">
        <div class="cell">空</div>
      </li>

      <li class="snippet-table" v-for="(value, index) in userData[key]" :key="index">
        <div class="cell col-1">{{ value.label }}</div>
        <div class="cell col-2">{{ value.command === "" ? "-" : value.command }}</div>
        <div class="cell col-3">{{ value.documentation }}</div>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SnippetGroup",

  props: {
    schema: { type: Object, required: true },
    userData: { type: Object, required: true },
  },

  setup(props) {
    return {};
  },
});
</script>

<style lang="less" scoped>
@import "./style.less";

.snippet-group {
  .group-option {
    &:hover {
      color: revert;
      background-color: revert;
    }
  }

  .snippet-table {
    width: 100%;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    list-style: none;
    cursor: pointer;
    background-color: var(--formGroup-hoverBg);
    display: flex;

    &:not(:first-child):hover {
      color: var(--formGroup-hoverFg);
      background: var(--button-Bg);
    }

    .cell {
      text-align: center;
      width: 100%;
    }

    .cell + .cell {
      border-left: 1px solid black;
    }

    .col-1 {
      width: 20%;
    }

    .col-2 {
      width: 10%;
    }

    .col-3 {
      width: 70%;
    }
  }

  .snippet-table + .snippet-table {
    border-top: 1px solid black;
  }
}
</style>
