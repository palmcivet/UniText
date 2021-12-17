import { ipcMain, dialog, BrowserWindow } from "electron";

ipcMain.handle("dialog:show-certificate-trust-dialog", (event, ...args) => {
  return dialog.showCertificateTrustDialog(args[0]);
});

ipcMain.handle("dialog:show-error-box", (event, ...args) => {
  return dialog.showErrorBox(args[0], args[1]);
});

ipcMain.handle("dialog:show-message-box", (event, ...args) => {
  const win = BrowserWindow.fromId(event.sender.id)!;
  return dialog.showMessageBox(win, args[0]);
});

ipcMain.handle("dialog:show-open-dialog", (event, ...args) => {
  const win = BrowserWindow.fromId(event.sender.id)!;
  return dialog.showOpenDialog(win, args[0]);
});

ipcMain.handle("dialog:show-save-dialog", (event, ...args) => {
  const win = BrowserWindow.fromId(event.sender.id)!;
  return dialog.showSaveDialog(win, args[0]);
});
