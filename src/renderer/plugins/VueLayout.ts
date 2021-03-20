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

type TLayoutKey = "WIN" | "SIDE" | "PANEL";

export interface IVueLayout {
  readonly $layout: {
    togglePart: (key: TLayoutKey) => void;
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

  private _callback!: TCallback;

  constructor(el: HTMLElement, opt: IPluginRunningItem, cb: TCallback) {
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
    this._callback = cb;
    this._registerSash(el);
    this.render();
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
    this._callback();
  }

  render() {
    const parent = (this._sashEle.parentElement as HTMLElement).clientWidth;
    if (parent === 0) return;
    this._container = parent;
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
    SIDE: { isLeft: true, ...opts.layout.side },
    PANEL: { isLeft: false, ...opts.layout.panel },
  };

  const _state: IPluginRunning<Container> = {};

  const _fire = (() => {
    const chain = {
      WIN: ["SIDE", "PANEL"],
      SIDE: ["PANEL"],
      PANEL: [],
    };
    return (key: TLayoutKey) => {
      chain[key].forEach((item) => _state[item] && _state[item].render());
    };
  })();

  window.addEventListener("resize", () => _fire("WIN"));

  _p.$layout = _p.$layout || {};

  _p.$layout.togglePart = (key: TLayoutKey) => {
    if (!_state[key]) throw new Error(`${key} not in 'SIDE' or 'PANEL'`);
    _state[key].toggle();
  };

  Vue.directive("sash", {
    inserted: (el, { value }) => {
      el.setAttribute("class", "unitext-resize");
      _state[value] = new Container(el, _setup[value], () => _fire(value));
    },
  });
};

export default {
  install,
};
