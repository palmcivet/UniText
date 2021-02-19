<template>
  <section>
    <div class="channels">
      <label
        v-for="(v, i) in channels"
        :key="i"
        :title="v.title"
        :class="channel === v.id ? 'active' : ''"
        @click="channel = v.id"
      >
        <i :class="v.icon" />
        <div>{{ v.label }}</div>
      </label>
    </div>

    <div class="specs" v-if="channel === 'MD'">
      <select v-model="spec">
        <option v-for="(v, i) in specs" :value="v.id" :key="i">{{ v.label }}</option>
      </select>
    </div>

    <div class="binaries" v-else>
      <CheckGroup :data="binaries" @change="binary = $event" />
    </div>

    <div class="commons">
      <CheckGroup :data="commons" @change="common = $event" />
    </div>

    <div class="unitext-button" @click="handleExport()">导 出</div>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import CheckGroup from "../widgets/CheckGroup.vue";

@Component({
  name: "Export",
  components: {
    CheckGroup,
  },
})
export default class Export extends Vue {
  channel = "PDF";

  spec = "GFM";

  binary = [
    { id: 1, val: "添加目录" },
    { id: 2, val: "添加页码" },
  ];

  common = [
    { id: 1, val: "语法检查" },
    { id: 2, val: "引用检查" },
  ];

  get channels() {
    return [
      { id: "MD", label: "Markdown", icon: "ri-markdown-line", title: "导出为 Markdown" },
      { id: "HTML", label: "HTML", icon: "ri-html5-line", title: "导出为 HTML" },
      { id: "PDF", label: "PDF", icon: "ri-file-word-2-line", title: "导出为 PDF" },
      { id: "RTF", label: "RTF", icon: "ri-file-ppt-2-line", title: "导出为 RTF" },
      { id: "DOCX", label: "DOCX", icon: "ri-file-word-2-line", title: "导出为 DOCX" },
      { id: "PNG", label: "PNG", icon: "ri-image-line", title: "导出为 PNG" },
    ];
  }

  get specs() {
    return [
      { id: "GFM", label: "GitHub Flavored", title: "" },
      { id: "CMM", label: "CommonMark", title: "" },
      { id: "YD", label: "Youdao Note", title: "" },
    ];
  }

  get binaries() {
    return {
      main: [
        { id: 1, label: "添加目录", title: "", check: true },
        { id: 2, label: "添加页码", title: "", check: true },
      ],
      addi: {
        id: 3,
        label: "选择样式",
        title: "",
        data: ["OneDark", "Material"],
      },
    };
  }

  get commons() {
    return {
      main: [
        { id: 1, label: "语法检查", title: "", check: true },
        { id: 2, label: "引用检查", title: "", check: true },
      ],
      addi: {
        id: 3,
        label: "Post Hook",
        title: "",
        check: false,
        data: ["Hook.js"],
      },
    };
  }

  handleExport() {
    // TODO 提交数据
    // spec 与 binary 互斥
    console.log(this.channel, this.spec, this.binary, this.common);
  }
}
</script>

<style lang="less" scoped>
* {
  user-select: none;
}

section {
  height: 100%;
  color: var(--sidePanel-Fg);
  background: var(--sidePanel-Bg);
  padding: 0 10%;

  > div {
    margin-bottom: 1em;
  }

  .channels {
    label {
      cursor: pointer;
      color: var(--button-Fg);
      background: var(--button-Bg);
      display: flex;
      width: 100%;
      margin-top: 6px;
      justify-content: center;

      i {
        margin-left: 1em;
        line-height: 2em;
      }

      div {
        width: 6em;
        margin-left: 0.5em;
        line-height: 2em;
      }

      &.active {
        position: relative;

        &::before {
          content: "";
          border: solid 2px var(--formGroupTitleBorder-Color); // DEV
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }

      &:hover {
        color: var(--button-hoverFg);
        background: var(--button-hoverBg);
      }
    }
  }

  .specs {
    select {
      width: 100%;
      height: 2em;
      font-size: 1em;
      text-align: center;
      color: var(--inputBox-Fg);
      background: var(--inputBox-Bg);
    }
  }
}
</style>
