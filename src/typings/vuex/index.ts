import { IGeneralState } from "./general";
import { ISideBarState } from "./sideBar";
import { IWorkBenchState } from "./workBench";
import { IStatusPanelState } from "./statusPanel";
import { IInformationState } from "./information";

export interface IRootState {
  general: IGeneralState;
  sideBar: ISideBarState;
  workBench: IWorkBenchState;
  statusPanel: IStatusPanelState;
  information: IInformationState;
}
