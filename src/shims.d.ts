declare module "*.vue" {
  import Vue from "vue";

  export default Vue;
}

declare module "*.json" {
  const data: any;

  export default data;
}

declare var __static: string;

declare module "markdown-it-sub";
declare module "markdown-it-sup";
declare module "markdown-it-ins";
declare module "markdown-it-mark";
declare module "markdown-it-emoji";
declare module "markdown-it-imsize";
declare module "markdown-it-footnote";
declare module "markdown-it-task-lists";
declare module "markdown-it-toc-and-anchor";
declare module "markdown-it-implicit-figures";
declare module "markdown-it-image-lazy-loading";
declare module "@iktakahiro/markdown-it-katex";

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

declare module "electron-devtools-installer" {
  // Type definitions for electron-devtools-installer v2.2.4
  // Project: https://github.com/MarshallOfSound/electron-devtools-installer
  // Definitions by: Robin Van den Broeck <https://github.com/gamesmaxed>
  //                 M. Fatih Mar <https://github.com/mfatihmar>
  // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

  interface ExtensionReference {
    id: string;
    electron: string;
  }

  // Default installation function
  export default function(
    extensionReference: ExtensionReference | string | Array<ExtensionReference | string>,
    forceDownload?: boolean
  ): Promise<string>;

  // Devtools themself
  export const EMBER_INSPECTOR: ExtensionReference;
  export const REACT_DEVELOPER_TOOLS: ExtensionReference;
  export const BACKBONE_DEBUGGER: ExtensionReference;
  export const JQUERY_DEBUGGER: ExtensionReference;
  export const ANGULARJS_BATARANG: ExtensionReference;
  export const VUEJS_DEVTOOLS: ExtensionReference;
  export const REDUX_DEVTOOLS: ExtensionReference;
  export const REACT_PERF: ExtensionReference;
  export const CYCLEJS_DEVTOOL: ExtensionReference;
  export const APOLLO_DEVELOPER_TOOLS: ExtensionReference;
  export const MOBX_DEVTOOLS: ExtensionReference;
}

declare interface Promise<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;

  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;

  cancel: () => void;
}
