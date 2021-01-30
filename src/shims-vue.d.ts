declare module "*.vue" {
  import Vue from "vue";

  export default Vue;
}

declare module "*.json" {
  const data: any;

  export default data;
}

declare module "markdown-it-mark";
declare module "markdown-it-sub";
declare module "markdown-it-sup";
declare module "markdown-it-emoji";
declare module "markdown-it-imsize";
declare module "markdown-it-footnote";
declare module "markdown-it-task-lists";
declare module "markdown-it-toc-and-anchor";
declare module "markdown-it-image-lazy-loading";
declare module "markdown-it-implicit-figures";
declare module "@iktakahiro/markdown-it-katex";

declare module "v-emoji-picker";
declare module "vue-custom-scrollbar";
declare module "vuedraggable" {
  export interface DraggedContext<T> {
    index: number;
    futureIndex: number;
    element: T;
  }

  export interface DropContext<T> {
    index: number;
    component: Vue;
    element: T;
  }

  export interface Rectangle {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  }

  export interface MoveEvent<T> {
    originalEvent: DragEvent;
    dragged: Element;
    draggedContext: DraggedContext<T>;
    draggedRect: Rectangle;
    related: Element;
    relatedContext: DropContext<T>;
    relatedRect: Rectangle;
    from: Element;
    to: Element;
    willInsertAfter: boolean;
    isTrusted: boolean;
  }

  const draggableComponent: ComponentOptions<Vue>;

  export default draggableComponent;
}

declare module "uslug" {
  /**
   * Generate a slug for the string passed.
   * @param value The string you want to slugify
   * @param options An optional object that can contain:
   *   - allowedChars: a String of chars that you want to be whitelisted. Default: '-_~'.
   *   - lower: a Boolean to force to lower case the slug. Default: true.
   *   - spaces: a Boolean to allow spaces. Default: false.
   */
  declare function uslug(value: string, options?: uslug.UslugOptions): string;

  declare namespace uslug {
    interface UslugOptions {
      allowedChars?: string;
      lower?: boolean;
      spaces?: boolean;
    }
  }

  export = uslug;
}

declare module "clone" {
  /**
   * @param val the value that you want to clone, any type allowed
   * @param circular Call clone with circular set to false if you are certain that obj contains no circular references. This will give better performance if needed. There is no error if undefined or null is passed as obj.
   * @param depth to wich the object is to be cloned (optional, defaults to infinity)
   */
  declare function clone<T>(val: T, circular?: boolean, depth?: number): T;

  declare namespace clone {
    /**
     * @param obj the object that you want to clone
     */
    function clonePrototype<T>(obj: T): T;
  }

  export = clone;
}
