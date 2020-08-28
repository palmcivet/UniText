import { App } from "./app";
import { loadBootData } from "@/common/initialize";

let unitext: App;

loadBootData().then((res) => {
  unitext = new App(res);
  unitext.init();
});
