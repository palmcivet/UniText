<template>
  <draggable
    tag="ul"
    ref="tabContainer"
    v-model="openedTabs"
    v-bind="dragOptions"
    :component-data="getCompData()"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
      <li
        v-for="v in openedTabs"
        :key="v.order"
        :class="v.order === openedFile ? 'current' : ''"
        @click.stop="selectTab(v.order)"
        @contextmenu.prevent=""
      >
        <span>{{ v.value }}</span>
        <i class="ri-close-line" @click.stop="closeTab(v.order)"></i>
      </li>
    </transition-group>
  </draggable>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component({
  name: "Tabs",
  components: {
    draggable,
  },
})
export default class Tabs extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  openedFile!: string;

  @Prop({
    type: Array,
    required: true,
  })
  tabGroup!: Array<{ order: string; value: string }> | null;

  drag = false;

  tabRef = this.$el as HTMLElement; // value for init

  get openedTabs() {
    return this.tabGroup;
  }

  set openedTabs(value) {
    this.$emit("switchTabs", value);
  }

  get dragOptions() {
    return {
      animation: 150,
      disabled: false,
      ghostClass: "ghost",
    };
  }

  getCompData() {
    return {
      on: {
        dblclick: (e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
          this.$emit("newFile");
        },
      },
    };
  }

  selectTab(index: string) {
    this.$emit("selectTab", index);
  }

  closeTab(index: string) {
    this.$emit("closeTab", index);
  }

  handleTabScroll(e: WheelEvent) {
    let delta = e.deltaY;
    if (e.deltaX !== 0) {
      delta = e.deltaX;
    }
    const tabs = this.tabRef;
    const newLeft = Math.max(0, Math.min(tabs.scrollLeft + delta, tabs.scrollWidth));
    tabs.scrollLeft = newLeft;
  }

  created() {
    this.$nextTick(() => {
      this.tabRef = (this.$refs.tabContainer as Vue).$children[0].$el as HTMLElement;
      this.tabRef.addEventListener("wheel", this.handleTabScroll);
    });
  }

  beforeDestroy() {
    this.tabRef.removeEventListener("wheel", this.handleTabScroll);
  }
}
</script>

<style lang="less" scoped>
@import "~@/asset/styles/var.less";

ul {
  cursor: pointer;

  & > span {
    display: flex;
    overflow: auto;
    line-height: @tab-height;

    & > li {
      background-color: rgba(227, 233, 209, 0.5); // DEV
      border-right: 1px solid rgba(200, 200, 200, 0.2); // DEV
      padding: 0 1.5em 0 0.8em;
      position: relative;

      & > span {
        max-width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        -webkit-user-select: none;
      }

      /deep/ i {
        line-height: 12px;
        font-size: 12px;
        border-radius: 50%;
        position: absolute;
        right: 0.5em;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
          background-color: rgba(148, 148, 148, 0.2); // DEV
        }
      }

      &.current {
        background-color: rgba(225, 235, 197, 0.7); // DEV
        border-bottom: 1px solid rgb(4, 174, 38);
      }

      &.ghost {
        opacity: 0.5;
        background: #c8ebfb;
      }
    }
  }
}
</style>
