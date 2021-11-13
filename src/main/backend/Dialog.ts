import { ipcMain, dialog } from "electron";

ipcMain.handle("dialog:show-certificate-trust-dialog", (event, ...args) => {
  return dialog.showCertificateTrustDialog(args[0]);
});

ipcMain.handle("dialog:show-error-box", (event, ...args) => {
  return dialog.showErrorBox(args[0], args[1]);
});

ipcMain.handle("dialog:show-message-box", (event, ...args) => {
  return dialog.showMessageBox(args[0]);
});

ipcMain.handle("dialog:show-open-dialog", (event, ...args) => {
  return dialog.showOpenDialog(args[0]);
});

ipcMain.handle("dialog:show-save-dialog", (event, ...args) => {
  return dialog.showSaveDialog(args[0]);
});
