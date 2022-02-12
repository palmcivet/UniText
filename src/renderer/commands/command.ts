export const CommandMap = {
  /* app begin */
  "app.aboutApp": { key: "" },
  "app.checkForUpdates": { key: "" },
  "app.hideWindow": { key: "CmdOrCtrl+H" },
  "app.hideOthers": { key: "Option+CmdOrCtrl+H" },
  "app.closeWindow": { key: "" },
  "app.quitApp": { key: "" },
  "app.openSetting": { key: "CmdOrCtrl+," },
  "app.openDashboard": { key: "" },
  "app.openGraphview": { key: "" },
  "app.openSchedule": { key: "" },
  "app.openReminder": { key: "" },
  "app.openCabin": { key: "" },
  "app.closeCabin": { key: "" },
  "app.transmitCabin": { key: "" },
  "app.addBookmark": { key: "" },
  "app.deleteBookmark": { key: "" },
  "app.toggleDevTools": { key: "Option+Cmd+I" },
  /* app end */

  /* file begin */
  "browser.copy": { key: "CmdOrCtrl+C" },
  "browser.move": { key: "" },
  "browser.rename": { key: "" },
  "browser.newFile": { key: "CmdOrCtrl+N" },
  "browser.newFolder": { key: "" },
  "browser.search": { key: "" },
  "browser.revealFile": { key: "" },

  "browser.readFile": { key: "" },
  "browser.editFile": { key: "" },
  "browser.saveFile": { key: "CmdOrCtrl+S" },
  "browser.saveFileAs": { key: "" },
  "browser.exportFile": { key: "" },

  /* edit */
  "edit.undo": { key: "CmdOrCtrl+Z" },
  "edit.redo": { key: "CmdOrCtrl+Shift+Z" },
  "edit.cut": { key: "CmdOrCtrl+X" },
  "edit.copy": { key: "CmdOrCtrl+C" },
  "edit.paste": { key: "CmdOrCtrl+V" },
  "edit.delete": { key: "Delete" },
  "edit.rename": { key: "Enter" },
  "edit.selectAll": { key: "CmdOrCtrl+A" },

  /* view */
  "view.sidebar": { key: "" },
  "view.sidepanel": { key: "" },
  "view.statusbar": { key: "" },
  "view.preview": { key: "" },
  "view.source": { key: "" },
  "view.auto-wrap": { key: "Option+Z" },
  "view.show-minimap": { key: "" },
  "view.show-space": { key: "" },

  /* format */
  "format.head-up": { key: "Shift+Ctrl+" },
  "format.head-down": { key: "Ctrl+Shift+" },
  "format.bold": { key: "CmdOrCtrl+B" },
  "format.italic": { key: "CmdOrCtrl+I" },
};

export type TCommand = keyof typeof CommandMap;
