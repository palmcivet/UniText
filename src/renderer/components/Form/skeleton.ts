import { defineComponent, PropType } from "vue";

interface IProperties {
  title: Array<string>;
  description: Array<string>;
  maximum?: number;
  minimum?: number;
}

export default defineComponent({
  props: {
    /**
     * @member 字段属性
     */
    prop: {
      type: Object as PropType<IProperties>,
      required: true,
    },

    /**
     * @member 字段初值
     */
    value: {
      required: false,
    },

    /**
     * @member 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentValue: this.value,
    };
  },
});
