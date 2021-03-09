import { IGeneralState } from "./general";
import { ISideBarState } from "./sideBar";
import { IWorkBenchState } from "./workBench";
import { IStatusPanelState } from "./statusPanel";
import { INotificationState } from "./notification";

export interface IRootState {
  general: IGeneralState;
  sideBar: ISideBarState;
  workBench: IWorkBenchState;
  statusPanel: IStatusPanelState;
  notification: INotificationState;
}
