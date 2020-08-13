import { IWorkBenchState } from "./vuex/workBench";
import { IGeneralState } from "./vuex/general";
import { ISideBarState } from "./vuex/sideBar";
import { INotificationState } from "./vuex/notification";

export interface IRootState {
  general: IGeneralState;
  sideBar: ISideBarState;
  workBench: IWorkBenchState;
  notification: INotificationState;
}
