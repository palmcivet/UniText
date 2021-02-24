<template>
  <section>
    <div v-if="tocTree.length === 0">目录为空</div>
    <ul v-else>
      <li
        v-for="(item, index) in tocTree"
        :key="index"
        @click.stop="handleRevealLine(item.line)"
        @contextmenu="handleContextToc(item)"
      >
        <div v-for="i in item.level - firstLevel" :key="i" />
        <pre />
        {{ item.content }}
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { namespace } from "vuex-class";
import { Vue, Component, Prop } from "vue-property-decorator";

import { BUS_EDITOR } from "@/common/channel/bus";
import { IPC_MENUMANAGER } from "@/common/channel/ipc";
import { ITocList } from "@/typings/renderer";
import { EMenuContextKey } from "@/typings/main";

const statusPanel = namespace("statusPanel");

@Component({
  name: "Toc",
})
export default class Toc extends Vue {
  @Prop({ type: Number, default: 2 })
  firstLevel!: number;

  @statusPanel.State("toc")
  tocTree!: Array<ITocList>;

  @statusPanel.Mutation("SYNC_TOC")
  SYNC_TOC!: (value: Array<ITocList>) => void;

  handleRevealLine(value: Array<number>) {
    this.$bus.emit(BUS_EDITOR.REVEAL_SECTION, value);
  }

  handleContextToc(value: ITocList) {
    ipcRenderer.send(IPC_MENUMANAGER.POPUP_CONTEXT, EMenuContextKey.PANEL_TOC);
  }

  handleSyncToc(value: Array<ITocList>) {
    this.SYNC_TOC(value);
  }

  mounted() {
    this.$bus.on(BUS_EDITOR.SYNC_TOC, this.handleSyncToc);
  }

  beforeDestroy() {
    this.$bus.off(BUS_EDITOR.SYNC_TOC, this.handleSyncToc);
  }
}
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/var.less";

@line-height: 1em;

* {
  user-select: none;
  font-family: @normal-font-family;
}

section {
  height: 100%;
  width: 100%;
  position: relative;
  color: var(--sidePanel-Fg);
  background: var(--sidePanel-Bg);

  > div {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, calc(50% - 1em));
  }

  > ul {
    height: 100%;
    overflow: auto;

    li {
      cursor: pointer;
      display: -webkit-box;
      white-space: nowrap;
      overflow: hidden;
      padding: 2px 0;

      &:hover {
        color: var(--sidePanelItem-hoverFg);
        background: var(--sidePanelItem-hoverBg);
      }

      div {
        width: 0.6em;
        border-right: 0.3px none;
      }

      pre {
        margin: 0;
        width: 0.3em;
      }
    }
  }
}
</style>
