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
        <a-icon type="close" size="small" @click.stop="closeTab(v.order)" />
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
    type: Number,
    required: true,
  })
  openedFile!: number;

  @Prop({
    type: Array,
    required: true,
  })
  tabGroup!: Array<{ order: number; value: string }> | null;

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
          this.$emit("newFile");
        },
      },
    };
  }

  selectTab(id: number) {
    this.$emit("selectTab", id);
  }

  closeTab(id: number) {
    this.$emit("closeTab", id);
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
  height: @tab-height;
  margin: 0;
  box-shadow: -1px 1px 5px rgba(207, 207, 207, 0.5);

  & > span {
    display: flex;
    overflow: auto;
    line-height: @tab-height;

    & > li {
      background-color: rgba(227, 233, 209, 0.5); // DEV
      border-left: 0.5px solid rgba(180, 180, 180, 0.5); // DEV
      padding: 0 1.5em 0 0.9em;
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
        font-size: 10px;
        vertical-align: middle;
        border-radius: 50%;

        position: absolute;
        right: 0.7em;
        top: 50%;
        transform: translateY(-50%);

        &:hover {
          background-color: rgba(148, 148, 148, 0.2); // DEV
        }
      }

      &.current {
        background-color: rgba(225, 235, 197, 0.7); // DEV
        border-bottom: 1px solid rgb(4, 174, 38);
        border-left: 0.5px solid rgba(230, 230, 230, 0.5);
      }

      &.ghost {
        opacity: 0.5;
        background: #c8ebfb;
      }
    }
  }
}
</style>
