import { Pool } from "./utils";
import { IList } from "./treeModel";
import "./treeView.less";

const SCROLLBAR_WIDTH = 8;
const ITEM_HEIGHT = 24;
const ITEM_TEMPLATE = `
<div class="indent"></div>
<i class="twist" style="line-height: ${ITEM_HEIGHT}px"></i>
<i class="icon" style="line-height: ${ITEM_HEIGHT}px"></i>
<div class="title" style="line-height: ${ITEM_HEIGHT}px"></div>`;

type THanldler = (idx: number) => void;

interface IListeners {
  click: THanldler;
  keydown: THanldler;
  context: THanldler;
}

export class TreeView {
  container!: HTMLElement;

  scrollbar!: HTMLElement;

  pool!: Pool<HTMLLIElement>;

  height!: number;

  get count() {
    return Math.ceil(this.height / ITEM_HEIGHT);
  }

  constructor(el: HTMLElement, evs: IListeners) {
    this.container = document.createElement("ul");
    this.container.className = "tree-view";
    el.appendChild(this.container);

    this.scrollbar = document.createElement("div");
    this.scrollbar.className = "scroll-bar";

    this.scrollbar.style.backgroundColor = "white"; // DEV
    this.scrollbar.style.width = `${SCROLLBAR_WIDTH}px`;
    this.scrollbar.style.height = "100%";
    this.scrollbar.style.position = "absolute";
    this.scrollbar.style.zIndex = "999";
    this.scrollbar.style.right = "0";
    this.scrollbar.style.top = "0";
    // el.appendChild(this.scrollbar);

    this.height = (el.parentElement as any).clientHeight;

    this.pool = new Pool(() => {
      const el = document.createElement("li");
      el.style.height = `${ITEM_HEIGHT}px`;
      el.innerHTML = ITEM_TEMPLATE;
      return el;
    }, this.count);

    for (const event in evs) {
      this.container.addEventListener(event, (e) => {
        const target = e.target as any;
        if (target.nodeName === "UL") return;
        evs[event as keyof IListeners](Number.parseInt(target.parentElement.className));
      });
    }

    this.container.addEventListener("mouseenter", this.onIndentShow.bind(this));
    this.container.addEventListener("mouseleave", this.onIndentHide.bind(this));
    this.container.addEventListener("scroll", this.onScroll.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onIndentShow() {
    this.container.classList.add("hover");
  }

  private onIndentHide() {
    this.container.classList.remove("hover");
  }

  private onScroll() {
    // 虚拟列表滚动
  }

  onResize() {
    this.height = this.container.clientHeight;
    this.pool.resize(this.count);
  }

  render(list: IList) {
    const children = this.container.children;

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
      this.container.appendChild(el);
    });
  }

  dispose() {
    this.container.removeEventListener("mouseenter", this.onIndentShow.bind(this));
    this.container.removeEventListener("mouseleave", this.onIndentHide.bind(this));
    this.container.addEventListener("scroll", this.onScroll.bind(this));
    window.removeEventListener("resize", this.onResize.bind(this));
  }
}
