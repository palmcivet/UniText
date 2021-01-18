<template>
  <ol>
    <CheckItem
      :itemGroup="checkMode"
      :condition="checkEdit ? 'true' : 'false'"
      @click="TOGGLE_CHECK()"
    />
    <CheckItem
      :itemGroup="presentMode"
      :condition="checkPresent ? 'true' : 'false'"
      @click="TOGGLE_PRESENT()"
    />
  </ol>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, namespace } from "vuex-class";

import CheckItem from "@/renderer/components/CheckItem.vue";
import { EEditMode, IGeneralState } from "@/typings/vuex/general";

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

  get checkMode() {
    return {
      SOURCE: {
        false: {
          icon: "ri-code-s-slash-fill",
          title: this.$t("status.sourceEdit"),
        },
        true: {
          icon: "ri-layout-column-fill",
          title: this.$t("status.sourcePreview"),
        },
      },
      WYSIWYG: {
        false: {
          icon: "ri-text",
          title: this.$t("status.wysiwygWrite"),
        },
        true: {
          icon: "ri-code-s-slash-fill",
          title: this.$t("status.wysiwygSource"),
        },
      },
      RICHTEXT: [{}],
    }[this.editMode];
  }

  get presentMode() {
    return {
      true: {
        icon: "ri-eye-line",
        title: this.$t("status.presentPreview"),
      },
      false: {
        icon: "ri-pencil-line",
        title: this.$t("status.presentEdit"),
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
