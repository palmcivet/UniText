import Logger from "@/main/backend/Logger";
import Service, { Inject } from "./Service";
import SettingService from "./SettingService";

export default class WindowService extends Service {
  private _window: any;

  @Inject("SettingService")
  private readonly _settingService!: SettingService;

  constructor(logger: Logger) {
    super(logger);
  }
}
