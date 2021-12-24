import Prism from "prismjs";
import { EventBus } from "@palmcivet/unitext-tree-view";
import { BUS_CHANNEL } from "@/shared/channel";
import { IDisposable } from "@/shared/typings/renderer";

export default class Viewer implements IDisposable {
  private root!: HTMLElement;

  private bus!: EventBus;

  constructor(bus: EventBus) {
    this.bus = bus;
  }

  public invoke(root: HTMLElement): void {
    this.root = root;

    this.bus.on(BUS_CHANNEL.EDITOR_SYNC_VIEW, this.onRender.bind(this));
  }

  public dispose(): void {
    this.bus.off(BUS_CHANNEL.EDITOR_SYNC_VIEW, this.onRender);
  }

  /* events */

  private async onRender(raw: string): Promise<void> {
    this.root.innerHTML = raw;
    setTimeout(() => {
      Prism.highlightAll();
    });
  }

  private onChange(): void {}

  private onScroll(): void {}
}
