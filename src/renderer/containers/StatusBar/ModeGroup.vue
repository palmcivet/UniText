<template>
  <ul class="mode-list">
    <!-- readMode -->
    <li :title="readModeGroup.title" @click="onClick('readMode')">
      <i :class="readModeGroup.icon" />
    </li>

    <!-- dbColumn -->
    <li :title="dbColumnGroup.title" @click="onClick('dbColumn')">
      <i :class="dbColumnGroup.icon" />
    </li>

    <!-- showPanel -->
    <li :title="showPanelGroup.title" @click="onClick('showPanel')">
      <i :class="showPanelGroup.icon" />
    </li>
  </ul>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { defineComponent } from "vue";
import useGeneral from "@/renderer/stores/general";
import { EEditMode } from "@/shared/typings/setting/preference";

interface IGroup {
  title: string;
  icon: string;
}

export default defineComponent({
  name: "ModeGroup",

  computed: {
    ...mapState(useGeneral, ["interface"]),

    readModeGroup(): IGroup {
      return {
        true: {
          icon: "ri-eye-line",
          title: this.$t("status.present_preview"),
        },
        false: {
          icon: "ri-edit-line",
          title: this.$t("status.present_edit"),
        },
      }[this.interface.readMode ? "true" : "false"];
    },

    dbColumnGroup(): IGroup {
      return {
        false: {
          false: {
            title: "富文本",
            icon: "ri-text",
          },
          true: {
            title: "源码",
            icon: "ri-code-s-slash-line",
          },
        },
        true: {
          false: {
            title: "源码",
            icon: "ri-code-s-slash-line",
          },
          true: {
            title: "对照",
            icon: "ri-layout-column-fill",
          },
        },
      }[this.interface.editMode === EEditMode.SOURCE ? "true" : "false"][
        this.interface.dbColumn ? "true" : "false"
      ];
    },

    showPanelGroup(): IGroup {
      return {
        false: {
          title: "侧边栏",
          icon: "ri-layout-right-2-line",
        },
        true: {
          title: "侧边栏",
          icon: "ri-layout-right-2-fill",
        },
      }[this.interface.showPanel ? "true" : "false"];
    },
  },

  methods: {
    onClick(event: "readMode" | "dbColumn" | "showPanel") {
      useGeneral().TOGGLE_MODE_GROUP(event);
    },
  },
});
</script>

<style lang="less" scoped></style>
