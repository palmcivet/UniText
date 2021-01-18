import { VueConstructor } from "vue/types/umd";

/* -------------------------- utils ------------------------------- */

function isDef(value: any) {
  return value !== undefined && value !== null;
}

function isObj(x: any) {
  const type = typeof x;
  return x !== null && (type === "object" || type === "function");
}

function assignKey(to: any, from: any, key: string) {
  const val = from[key];

  if (!isDef(val)) {
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(to, key) || !isObj(val)) {
    to[key] = val;
  } else {
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

function deepGet(object: any, path: string) {
  const keys = path.split(".");
  let result = object;

  keys.forEach((key) => {
    result = result[key];
  });

  return result;
}

function deepAssign(to: any, from: any) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });

  return to;
}

/* -------------------------- types ------------------------------- */

type TMessage = string[];

interface IMessageObject {
  [key: string]: IMessageObject | TMessage;
}

interface IPluginOptions {
  lang: number;
  messages: IMessageObject;
}

interface VueI18n {
  readonly i18n: {
    lang: number;
    add: (msg: object) => void;
    setLang: (msg: number) => void;
  };
  $t: (path: string, ...args: any) => any;
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>, options: IPluginOptions) => {
  const proto = Vue.prototype;
  proto.$i18n = proto.$i18n || {};

  deepAssign(proto.$i18n, options);

  const _vm = new Vue({
    data: options,
  });

  Object.defineProperty(Vue.prototype.$i18n, "lang", {
    get() {
      return _vm.lang;
    },
  });

  proto.$t = (path: string, ...args: any) => {
    const message = deepGet(_vm.messages, path);
    return typeof message === "function" ? message(...args) : message[_vm.lang] || path;
  };

  proto.$i18n.add = (messages = {}) => {
    deepAssign(proto.$i18n.messages, messages);
  };

  proto.$i18n.setLang = (lang: number) => {
    _vm.lang = lang;
  };

  Vue.mixin({
    beforeCreate() {
      const options = this.$options as any;
      options.i18n && (this as any).$i18n.add(options.i18n);
    },
  });
};

export const I18n = {
  install,
};
