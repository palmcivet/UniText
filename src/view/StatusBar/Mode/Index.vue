<template>
  <ol>
    <check-item
      :itemGroup="checkMode"
      :condition="checkEdit ? 'true' : 'false'"
      @click="TOGGLE_CHECK()"
    />
    <check-item
      :itemGroup="presentMode"
      :condition="checkPresent ? 'true' : 'false'"
      @click="TOGGLE_PRESENT()"
    />
  </ol>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import { EEditMode, IGeneralState } from "@/interface/vuex/modules/general";
import CheckItem from "@/widget/CheckItem/Index.vue";

const general = namespace("general");

@Component({
  name: "Mode",
  components: {
    CheckItem,
  },
})
export default class Mode extends Vue {
  @general.State((state: IGeneralState) => state.appearance.editMode)
  editMode!: EEditMode;

  @general.State((state: IGeneralState) => state.appearance.checkEdit)
  checkEdit!: boolean;

  @general.State((state: IGeneralState) => state.appearance.checkPresent)
  checkPresent!: boolean;

  @general.Mutation("TOGGLE_CHECK")
  TOGGLE_CHECK!: () => void;

  @general.Mutation("TOGGLE_PRESENT")
  TOGGLE_PRESENT!: () => void;

  // DEV i18n
  get checkMode() {
    return {
      SOURCE: {
        false: {
          title: "书写",
          icon: "ri-code-s-slash-fill",
        },
        true: {
          title: "预览",
          icon: "ri-layout-column-fill",
        },
      },
      WYSIWYG: {
        false: {
          title: "书写",
          icon: "ri-text",
        },
        true: {
          title: "源码",
          icon: "ri-code-s-slash-fill",
        },
      },
      RICHTEXT: [{}],
    }[this.editMode];
  }

  get presentMode() {
    return {
      true: {
        title: "浏览模式",
        icon: "ri-eye-line",
      },
      false: {
        title: "编辑模式",
        icon: "ri-pencil-line",
      },
    };
  }
}
</script>

<style lang="less" scoped>
li.active {
  background-color: rgb(207, 231, 174); // DEV
}
</style>
