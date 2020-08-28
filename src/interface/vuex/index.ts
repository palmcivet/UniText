import { IPanelState } from "./modules/panel";
import { IGeneralState } from "./modules/general";
import { ISideBarState } from "./modules/sideBar";
import { IStatusBarState } from "./modules/statusBar";
import { IWorkBenchState } from "./modules/workBench";
import { INotificationState } from "./modules/notification";

export interface IRootState {
  panel: IPanelState;
  general: IGeneralState;
  sideBar: ISideBarState;
  statusBar: IStatusBarState;
  workBench: IWorkBenchState;
  notification: INotificationState;
}
