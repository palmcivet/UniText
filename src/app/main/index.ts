import { protocol, app } from "electron";
import * as fse from "fs-extra";

import { UniText } from "./UniText";
import { IBootArgs } from "@/typings/bootstrap";
import { joinPath } from "@/common/files";
import { UNITEXT_SYSTEM } from "@/common/env";

const bootData = async () => {
  const bootArgs: IBootArgs = {
    notesPath: "",
    error: [],
  };

  try {
    const res = await fse.readJSON(
      joinPath(app.getPath("userData"), ...UNITEXT_SYSTEM.BOOT_FILE)
    );
    if (Object.keys(res).indexOf("notesPath") !== -1) {
      bootArgs.notesPath = res.notesPath;
    }
  } catch (err) {
    bootArgs.error.push(err);
  }

  return bootArgs;
};

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let APP: UniText;

bootData().then((res) => {
  APP = new UniText(res);
  APP.init();
});
