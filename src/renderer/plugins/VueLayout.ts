import { VueConstructor } from "vue/types/umd";

/* -------------------------- utils ------------------------------- */

const setWidth = (el: HTMLElement, val: number) => {
  el.setAttribute("style", `width: ${val}px`);
};

const setHide = (el: HTMLElement, flag: boolean) => {
  el.setAttribute("style", `display: ${flag ? "none" : "inherit"}`);
};

/* -------------------------- types ------------------------------- */

interface IPartParams {
  width: number;
  range: [number, number];
  close: boolean;
}

interface IPluginOptions {
  setup: {
    sash: number;
    width: number;
    height: number;
  };
  layout: {
    side: IPartParams;
    panel: IPartParams;
  };
  cross: {
    width: number;
    close: "left" | "right";
    range: number;
  };
}

type TPartKey = UnionKey<IPluginOptions>;

export interface IVueLayout {
  readonly $layout: {
    registerPart: () => void;
  };
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>, opts: IPluginOptions) => {
  const p = Vue.prototype;

  const _setup = opts.setup;
  const _reserved = _setup.sash + 44;

  const _vm: {
    [K: string]: {
      width: number;
      range: [number, number];
      close: boolean;
      isLeft: boolean;
      parent: number;
      another: number;
    };
  } = {
    side: {
      isLeft: true,
      ...opts.layout.side,
      get parent() {
        return _setup.width;
      },
      get another() {
        return _setup.width - _vm.side.width - _reserved;
      },
    },
    panel: {
      isLeft: false,
      ...opts.layout.panel,
      get parent() {
        return _vm.side.width;
      },
      get another() {
        return _vm.side.another - _vm.panel.width - _setup.sash;
      },
    },
  };

  const renderWidth = () => {
    // setWidth(prevEle, finalWidth);
    // setWidth(nextEle, parent.width - finalWidth - reserved);
  };

  const togglePart = () => {};

  const handleResize = () => {
    _setup.width = document.body.clientWidth;
    _setup.height = document.body.clientHeight;
    renderWidth();
  };

  window.addEventListener("resize", handleResize);

  p.$layout = p.$layout || {};

  p.$layout.registerPart = () => {};

  Vue.directive("sash", {
    inserted: (el, binding) => {
      const v = _vm[binding.value as TPartKey];

      const prevEle = (v.isLeft
        ? el.previousElementSibling
        : el.nextElementSibling) as HTMLElement;
      const nextEle = (v.isLeft
        ? el.nextElementSibling
        : el.previousElementSibling) as HTMLElement;

      /**
       * Start point for caculate the distance
       */
      let startX = 0;
      /**
       * Start position
       */
      let startWidth = prevEle.clientWidth;
      /**
       * Immediate position when dragging the sash
       */
      let immedWidth = startWidth;
      /**
       * Final width for the 'left' part
       */
      let finalWidth = 0;

      const mouseMoveHandler = (e: MouseEvent) => {
        const offset = e.clientX - startX;
        immedWidth = startWidth + (v.isLeft ? offset : -offset);
        if (immedWidth < v.range[0]) {
          finalWidth = v.range[0];
        } else if (immedWidth > v.range[1]) {
          finalWidth = v.range[1];
        } else {
          finalWidth = immedWidth;
        }
        v.width = finalWidth;
        console.log(_vm);
        setWidth(prevEle, finalWidth);
        setWidth(nextEle, v.another);
      };

      const mouseUpHandler = (e: MouseEvent) => {
        document.removeEventListener("mousemove", mouseMoveHandler, false);
        document.removeEventListener("mouseup", mouseUpHandler, false);
        if (immedWidth >= v.range[0] && immedWidth <= v.range[1]) {
          finalWidth = immedWidth;
          v.width = finalWidth;
          setWidth(prevEle, finalWidth);
          setWidth(nextEle, v.another);
        }
      };

      const mouseDownHandler = (e: MouseEvent) => {
        startX = e.clientX;
        startWidth = prevEle.clientWidth;
        document.addEventListener("mousemove", mouseMoveHandler, false);
        document.addEventListener("mouseup", mouseUpHandler, false);
      };

      el.addEventListener("mousedown", mouseDownHandler, false);
    },
    unbind: () => {},
  });
};

export default {
  install,
};
