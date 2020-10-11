import { protocol } from "electron";
import * as fse from "fs-extra";

import { App } from "./app";
import { IBootArgs } from "@/typings/bootstrap";
import { UNITEXT_SYSTEM } from "@/common/env";

const bootData = async () => {
  const bootArgs: IBootArgs = {
    notesPath: "",
    error: [],
  };

  try {
    const res = await fse.readJSON(UNITEXT_SYSTEM.BOOT);
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

let unitext: App;

bootData().then((res) => {
  unitext = new App(res);
  unitext.init();
});
