import { IEditorState } from "./vuex/editor";
import { IGeneralState } from "./vuex/general";
import { ISideBarState } from "./vuex/sideBar";
import { INotificationState } from "./vuex/notification";

export interface IRootState {
  editor: IEditorState;
  general: IGeneralState;
  sideBar: ISideBarState;
  notification: INotificationState;
}
