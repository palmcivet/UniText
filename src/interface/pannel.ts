import { ITocList } from "@/common/helpers/create-toc";

export interface IPannelState {
  toc: {
    tableOfContent: Array<ITocList>;
  };
  export: {};
}

export interface ITocTree extends ITocList {
  sub: Array<ITocTree>;
}
