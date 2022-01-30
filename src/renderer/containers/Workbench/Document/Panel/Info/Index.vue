<template>
  <div class="panel-info">
    <InfoCardDate :raw="meta.cTime" :remark="$t('panel.created')" />
    <InfoCardDate :raw="meta.mTime" :remark="$t('panel.modified')" />

    <div class="info-grid">
      <InfoCardNormal
        class="info-grid-cell"
        :raw="computable.wordCount"
        :remark="$t('panel.word_count')"
      />
      <InfoCardNormal
        class="info-grid-cell"
        :raw="computable.charCount"
        :remark="$t('panel.char_count')"
      />
      <InfoCardTime
        class="info-grid-cell"
        :raw="meta.editTime"
        :remark="$t('panel.edit_time')"
      />
      <InfoCardTime
        class="info-grid-cell"
        :raw="computable.readTime"
        :remark="$t('panel.read_time')"
      />
    </div>

    <div class="info-form-divider"></div>

    <ul class="info-form">
      <li class="info-form-item">
        <div class="info-form-label">缩进方式</div>
        <FormSelect
          class="info-form-value"
          :value="format.indent"
          :options="optionsIndent"
          @form-change="onChangeInfo('indent', $event)"
        />
      </li>

      <li class="info-form-item">
        <div class="info-form-label">编码方式</div>
        <FormSelect
          class="info-form-value"
          :value="format.encoding"
          :options="optionsCoding"
          @form-change="onChangeInfo('encoding', $event)"
        />
      </li>

      <li class="info-form-item">
        <div class="info-form-label">行尾序列</div>
        <FormSelect
          class="info-form-value"
          :value="format.endOfLine"
          :options="optionsEoL"
          @form-change="onChangeInfo('endOfLine', $event)"
        />
      </li>

      <div class="info-form-divider"></div>

      <li class="info-form-item">
        <div class="info-form-label">状态</div>
        <label class="info-form-value info-form-complete">
          <FormInput
            type="checkbox"
            :value="config.complete"
            @form-change="onChangeConfig('complete', $event)"
          />
          <span class="info-form-complete__label">
            {{ config.complete ? "已完成" : "未完成" }}
          </span>
        </label>
      </li>

      <li class="info-form-item">
        <div class="info-form-label">标签</div>
        <ul class="info-form-value info-form-tag">
          <li
            class="info-form-tag__item"
            v-for="(tag, index) in config.tags"
            :key="index"
          >
            <i class="ri-hashtag" />
            <span class="info-form-tag__label">{{ tag }}</span>
          </li>
        </ul>
      </li>

      <li class="info-form-item">
        <div class="info-form-label">图片方案</div>
        <FormSelect
          class="info-form-value"
          :value="config.picture"
          :options="optionsPicture"
          @form-change="onChangeConfig('picture', $event)"
        />
      </li>

      <li class="info-form-item">
        <div class="info-form-label">备注</div>
        <div class="info-form-value">
          <FormTextarea
            :value="config.remark"
            rows="5"
            @form-change="onChangeConfig('remark', $event)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";

import InfoCardDate from "./InfoCardDate.vue";
import InfoCardTime from "./InfoCardTime.vue";
import InfoCardNormal from "./InfoCardNormal.vue";
import useWorkbench from "@/renderer/stores/workbench";
import FormTextarea from "@/renderer/components/Form/FormTextarea.vue";
import FormSelect from "@/renderer/components/Form/FormSelect.vue";
import FormInput from "@/renderer/components/Form/FormInput.vue";
import { EMDPicture, ETXTCoding, ETXTEoL, ETXTIndent } from "@/shared/typings/document";

function mapEnumToSelectOption(rawEnum: any): Array<{ label: string; value: any }> {
  return Object.entries(rawEnum).map(([label, value]) => ({ label, value }));
}

export default defineComponent({
  name: "Info",

  inject: ["$workbench"],

  components: {
    InfoCardDate,
    InfoCardTime,
    InfoCardNormal,
    FormTextarea,
    FormSelect,
    FormInput,
  },

  setup() {
    const { frontmatter, computable, format } = storeToRefs(useWorkbench());

    const meta = computed(() => frontmatter.value.meta);
    const config = computed(() => frontmatter.value.config);

    return {
      meta,
      config,
      format,
      computable,
      optionsIndent: mapEnumToSelectOption(ETXTIndent),
      optionsCoding: mapEnumToSelectOption(ETXTCoding),
      optionsEoL: mapEnumToSelectOption(ETXTEoL),
      optionsPicture: mapEnumToSelectOption(EMDPicture),
    };
  },

  methods: {
    onChangeInfo(field: string, value: boolean | string) {
      if ((this.format as any)[field] === value) {
        return;
      }

      this.$workbench.doChangeMarkdown({
        format: { [field]: value },
      } as any);
    },

    onChangeConfig(field: string, value: boolean | string) {
      if ((this.config as any)[field] === value) {
        return;
      }

      this.$workbench.doChangeMarkdown({
        config: { [field]: value },
      } as any);
    },
  },
});
</script>

<style lang="less" scoped>
@import "~@/renderer/styles/mixins.less";

.panel-info {
  @cell-gap: 5px;

  height: 100%;
  overflow-y: overlay;
  padding: 0 @cell-gap;

  .info-card {
    margin: @cell-gap 0;
  }

  .info-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;

    &-cell {
      width: calc(50% - @cell-gap * 2);
    }
  }

  .info-form {
    font-size: 14px;

    &-item {
      width: 100%;
      min-height: 24px;
      margin: @cell-gap 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-label {
      width: 26%;
      text-align: right;
      user-select: none;
    }

    &-value {
      width: 70%;
    }

    &-divider {
      width: 100%;
      height: 1em;
    }

    &-complete {
      display: flex;
      height: 100%;
      cursor: pointer;

      .form-input__wrapper {
        line-height: 0;
      }

      &__label {
        line-height: 24px;
        margin-left: @cell-gap;
      }
    }

    &-tag {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      &__item {
        cursor: pointer;
        border-radius: 8px;
        padding-right: 5px;
        display: flex;
        align-items: center;
        background-color: #153f58;

        &:hover {
          background-color: #244c80;
        }
      }

      &__label {
        max-width: 5em;
        .ellipsis();
      }
    }
  }
}
</style>
