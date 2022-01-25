import { ipcMain, dialog, BrowserWindow } from "electron";
import { IPC_CHANNEL } from "@/shared/channel";

ipcMain.handle(IPC_CHANNEL.DIALOG_SHOW_CERTIFICATE_TRUST_DIALOG, (event, ...args) => {
  return dialog.showCertificateTrustDialog(args[0]);
});

ipcMain.handle(IPC_CHANNEL.DIALOG_SHOW_ERROR_BOX, (event, ...args) => {
  return dialog.showErrorBox(args[0], args[1]);
});

ipcMain.handle(IPC_CHANNEL.DIALOG_SHOW_MESSAGE_BOX, (event, ...args) => {
  const win = BrowserWindow.fromId(event.sender.id)!;
  return dialog.showMessageBox(win, args[0]);
});

ipcMain.handle(IPC_CHANNEL.DIALOG_SHOW_OPEN_DIALOG, (event, ...args) => {
  const win = BrowserWindow.fromId(event.sender.id)!;
  return dialog.showOpenDialog(win, args[0]);
});

ipcMain.handle(IPC_CHANNEL.DIALOG_SHOW_SAVE_DIALOG, (event, ...args) => {
  const win = BrowserWindow.fromId(event.sender.id)!;
  return dialog.showSaveDialog(win, args[0]);
});
