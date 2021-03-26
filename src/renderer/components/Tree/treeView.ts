import { IList } from "./treeModel";
import "./treeView.less";

const HEIGHT = 24;
const TEMPLATE = `
<div class="indent"></div>
<i class="twist" style="line-height: ${HEIGHT}px"></i>
<i class="icon" style="line-height: ${HEIGHT}px"></i>
<div class="title" style="line-height: ${HEIGHT}px"></div>`;

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
    this.root.style.position = "relative";
    this.root.style.overflowY = "auto";
    el.appendChild(this.root);

    this.count = Math.ceil((el.parentElement as any).clientHeight / HEIGHT);

    this.pool = new Pool(() => {
      const el = document.createElement("li");
      el.style.height = `${HEIGHT}px`;
      el.innerHTML = TEMPLATE;
      return el;
    }, this.count);

    for (const event in evs) {
      this.root.addEventListener(event, (e) => {
        const target = e.target as any;
        if (target.nodeName === "UL") return;
        evs[event as keyof IListeners](Number.parseInt(target.parentElement.className));
      });
    }

    this.root.addEventListener("mouseenter", this.indentShow.bind(this));
    this.root.addEventListener("mouseleave", this.indentHide.bind(this));
    window.addEventListener("resize", this.resize.bind(this));
  }

  private indentShow() {
    this.root.classList.add("hover");
  }

  private indentHide() {
    this.root.classList.remove("hover");
  }

  resize() {
    this.count = Math.ceil(this.root.clientHeight / HEIGHT);
    this.pool.resize(this.count);
  }

  render(list: IList) {
    const children = this.root.children;

    for (let i = children.length - 1; i >= 0; i--) children[i].remove();

    this.pool.fetch(list.length).forEach((el, i) => {
      el.className = i.toString();
      el.title = list[i].name;

      el.children[0].innerHTML = "<div></div>".repeat(list[i].getIndent(-1));

      if (list[i].collapsible) {
        const collapsed = (list[i] as any).collapsed;
        el.children[1].className = collapsed
          ? "ri-arrow-right-s-line"
          : "ri-arrow-down-s-line";
        el.children[2].className = collapsed ? "ri-folder-2-line" : "ri-folder-open-line";
        // FEAT icon
      } else {
        el.children[1].className = "";
        el.children[2].className = "ri-markdown-line"; // FEAT icon
      }
      el.children[3].innerHTML = list[i].name;
      this.root.appendChild(el);
    });
  }

  dispose() {
    this.root.removeEventListener("mouseenter", this.indentShow.bind(this));
    this.root.removeEventListener("mouseleave", this.indentHide.bind(this));
    window.removeEventListener("resize", this.resize.bind(this));
  }
}
