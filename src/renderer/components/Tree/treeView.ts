import { IList } from "./treeModel";
import "./treeView.less";

const HEIGHT = 24;

interface IListeners {
  click: (idx: number) => void;
  keydown: (idx: number) => void;
}

/**
 * @description 在本组件中，不会出现超额度使用的情况，文件项数量始终大于可见项数量，因此具有以下限制：
 * - `use()` 方法不判断超额
 * - `resize()` 方法根据传入值分配空间
 */
class Pool<T> {
  private pool!: T[];

  private creator!: () => T;

  constructor(creator: () => T, size = 10) {
    this.pool = [];
    this.creator = creator;

    for (let i = 0; i < size; i++) this.pool.push(this.creator());
  }

  fetch(num: number) {
    return this.pool.slice(0, num);
  }

  resize(num: number) {
    if (num > this.pool.length) {
      const len = num - this.pool.length;
      for (let i = 0; i < len; i++) this.pool.push(this.creator());
    } else {
      this.pool = this.pool.slice(0, num);
    }
  }
}

export class TreeView {
  root!: HTMLElement;

  pool!: Pool<HTMLLIElement>;

  count!: number;

  constructor(el: HTMLElement, evs: IListeners) {
    this.root = document.createElement("ul");
    this.root.className = "tree-view";
    this.root.style.height = "100%";
    this.root.style.overflowY = "auto";
    el.appendChild(this.root);

    this.count = Math.ceil(this.root.clientHeight / HEIGHT);

    this.pool = new Pool(() => {
      const el = document.createElement("li");
      el.style.height = `${HEIGHT}px`;
      return el;
    }, this.count);

    for (const event in evs) {
      this.root.addEventListener(event, (e) => {
        evs[event as keyof IListeners](Number.parseInt((e.target as any).className));
      });
    }

    window.addEventListener("resize", this.onResize);
  }

  onResize() {
    this.count = Math.ceil(this.root.clientHeight / HEIGHT);
    this.pool.resize(this.count);
  }

  render(list: IList) {
    const children = this.root.children;

    for (let i = children.length - 1; i >= 0; i--) children[i].remove();

    this.pool.fetch(list.length).forEach((el, i) => {
      el.className = i.toString();
      el.innerHTML = list[i].name;
      this.root.appendChild(el);
    });
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
  }
}
