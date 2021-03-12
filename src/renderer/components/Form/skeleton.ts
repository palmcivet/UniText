import { Vue, Component, Prop } from "vue-property-decorator";

interface IProperties {
  title: Array<string>;
  description: Array<string>;
  maximum?: number;
  minimum?: number;
}

@Component({ name: "skeleton" })
export default class skeleton extends Vue {
  /**
   * @member 字段属性
   */
  @Prop({ type: Object, required: true })
  prop!: IProperties;

  /**
   * @member 字段初值
   */
  @Prop({ default: false })
  value!: any;

  /**
   * @member 是否禁用
   */
  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  /**
   * @member 字段终值
   */
  res!: any;

  data() {
    return {
      res: this.value,
    };
  }

  handleChange() {
    this.$emit("change", this.res);
  }
}
