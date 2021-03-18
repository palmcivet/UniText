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
  range: [number, number];
  isClose: boolean;
  mainPart: number;
}

interface IPluginOptions {
  setup: {
    width: number;
    height: number;
  };
  layout: {
    side: IPartParams;
    panel: IPartParams;
  };
  cross: {
    range: number;
    width: number;
    close: "left" | "right";
  };
}

interface IPluginRunningItem {
  range: [number, number];
  isLeft: boolean;
  isClose: boolean;
  mainPart: number;
}

interface IPluginRunning<T> {
  [K: string]: T;
}

export interface IVueLayout {
  readonly $layout: {
    togglePart: (key: string) => void;
  };
}

/* -------------------------- class ------------------------------- */

const SASH = 2;

class Container {
  private _sashEle!: HTMLElement;

  private _prevEle!: HTMLElement;

  private _nextEle!: HTMLElement;

  private _range!: [number, number];

  private _isLeft!: boolean;

  private _isClose!: boolean;

  private _mainPart!: number;

  private _container!: number;

  private _ob!: ResizeObserver;

  constructor(el: HTMLElement, opt: IPluginRunningItem) {
    this._sashEle = el;
    this._prevEle = (opt.isLeft
      ? el.previousElementSibling
      : el.nextElementSibling) as HTMLElement;
    this._nextEle = (opt.isLeft
      ? el.nextElementSibling
      : el.previousElementSibling) as HTMLElement;

    this._range = opt.range;
    this._isLeft = opt.isLeft;
    this._isClose = opt.isClose;
    this._mainPart = opt.mainPart;

    this._registerResize(el);
    this._registerSash(el);
    this.render();
  }

  private _registerResize(el: HTMLElement) {
    el.parentElement?.addEventListener("resize", () => this.render());
  }

  private _registerSash(el: HTMLElement) {
    /**
     * Start point for caculate the distance
     */
    let startX = 0;
    /**
     * Start position
     */
    let startWidth = this._prevEle.clientWidth;
    /**
     * Immediate position when dragging the sash
     */
    let immedWidth = startWidth;

    const mouseMoveHandler = (e: MouseEvent) => {
      const offset = e.clientX - startX;
      immedWidth = startWidth + (this._isLeft ? offset : -offset);
      if (immedWidth < this._range[0]) {
        this._mainPart = this._range[0];
      } else if (immedWidth > this._range[1]) {
        this._mainPart = this._range[1];
      } else {
        this._mainPart = immedWidth;
      }
      this._renderWidth();
    };

    const mouseUpHandler = (e: MouseEvent) => {
      document.removeEventListener("mousemove", mouseMoveHandler, false);
      document.removeEventListener("mouseup", mouseUpHandler, false);
      if (immedWidth >= this._range[0] && immedWidth <= this._range[1]) {
        this._mainPart = immedWidth;
        this._renderWidth();
      }
    };

    const mouseDownHandler = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = this._prevEle.clientWidth;
      document.addEventListener("mousemove", mouseMoveHandler, false);
      document.addEventListener("mouseup", mouseUpHandler, false);
    };

    el.addEventListener("mousedown", mouseDownHandler, false);
  }

  private _renderWidth() {
    const prev = this._isClose ? 0 : this._mainPart;
    const next = this._isClose ? this._container : this._container - prev - SASH;
    setWidth(this._prevEle, prev);
    setWidth(this._nextEle, next);
  }

  render() {
    this._container = (this._sashEle.parentElement as HTMLElement).clientWidth;
    this._renderWidth();
  }

  toggle() {
    this._isClose = !this._isClose;
    setHide(this._sashEle, this._isClose);
    this._renderWidth();
  }
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>, opts: IPluginOptions) => {
  const _p = Vue.prototype;

  const _setup: IPluginRunning<IPluginRunningItem> = {
    side: { isLeft: true, ...opts.layout.side },
    panel: { isLeft: false, ...opts.layout.panel },
  };

  const _state: IPluginRunning<Container> = {};

  const _resizeAll = () => {
    _state.side.render();
    _state.panel.render();
  };

  _p.$layout = _p.$layout || {};

  _p.$layout.togglePart = (key: string) => {
    if (!_state[key]) throw new Error(`${key} not in 'side' or 'panel'`);
    _state[key].toggle();
    _resizeAll();
  };

  Vue.directive("sash", {
    inserted: (el, binding) => {
      _state[binding.value] = new Container(el, _setup[binding.value]);
    },
    unbind: () => {},
  });
};

export default {
  install,
};
