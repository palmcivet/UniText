import { app } from "electron";

export default {
  app: {
    system: {
      label: app.name,
      aboutApp: `About ${app.name}`,
      quitApp: `Quit ${app.name}`,
      checkForUpdates: "Check for Updates",
      services: "Service",
      hideWindow: "Hide",
      hideOthers: "Hide Others",
      closeWindow: "Close Window",
    },

    file: {
      label: "File",
      openCabin: "Open Cabin",
      closeCabin: "Close Cabin",
      transmitCabin: "Transmit Cabin",
      addBookmark: "Add Bookmark",
      deleteBookmark: "Delete Bookmark",
      newFile: "New File",
      newFolder: "New Folder",
      readFile: "Read File",
      editFile: "Edit File",
      renameFile: "Rename File",
      saveFile: "Save",
      saveFileAs: "Save As",
      revealInOs: "Reveal in File Explorer",
      exportFile: "Export File",
    },

    edit: {
      label: "Edit",
      undo: "Unde",
      redo: "Redo",
      cut: "Cut",
      copy: "Copt",
      paste: "Paste",
      delete: "Delete",
      selectAll: "Select All",
      find: "Find",
      replace: "Replace",
    },

    view: {
      label: "View",
      fullScreen: "Fullscreen",
      showStatusbar: "Status Bar",
      showBrowser: "Explorer",
      showPanel: "Panel",
      togglePalette: "Palette",
      togglePreview: "Preview Mode",
      toggleSource: "Edit Mode",
      autoWrap: "Auto Wrap",
      showMinimap: "Show Minimap",
      showSpaces: "Show Spaces",
    },

    format: {
      label: "Format",
      setHeadUp: "Head Up",
      setHeadDown: "Head Down",
      insertOrderedList: "Ordered List",
      insertUnorderedList: "Unordered List",
      insertSup: "Insert Sup",
      insertSub: "Insert Sub",
      insertImage: "Insert Image",
      insertLink: "Insert Link",
      insertTOC: "Inset TOC",
      toggleBold: "Bold",
      toggleItalic: "Italic",
      toggleMark: "Mark",
      toggleStrikethrough: "Strikethrough",
    },

    window: {
      label: "Window",
    },

    help: {
      label: "Help",
      reportBugs: "Report bugs",
      moreInfo: "More Info",
      toggleDevTools: "Toggle DevTools",
    },
  },

  context: {
    toc: {
      setHeadUp: "Head Up",
      setHeadDown: "Head Down",
      renameTitle: "Rename Head",
    },

    tab: {
      closeCurrentTab: "Close Current Tab",
      closeSavedTab: "Close Saved Tabs",
      closeAllTab: "Close All Tabs",
      saveAllTab: "Save All Tabs",
      preview: "Preview",
      pinCurrentTab: "Pin Current Tab",
    },

    file: {},

    folder: {},
  },

  dock: {
    newWindow: "New Window",
    newAgenda: "New Agenda",
    newNote: "New Note",
  },

  tray: {},

  view: {
    workbench: {
      dashboard: "Dashboard",
      graphview: "Graph View",
      schedule: "Schedule",
      reminder: "Reminder",
      setting: "Setting",
      startup: {
        tips: "Double Click To New File",
      },
    },

    browser: {
      file: {
        label: "File",
        title: "File",
        toggleFolder: "Toggle Folders",
        emptyCabin: "Empty Cabin",
        openCabin: "Open Cabin",
      },
      search: {
        label: "Search",
        clear: "Clear Search Result",
        refresh: "Refresh",
      },
      bookmark: {
        label: "Bookmark",
      },
      tag: {
        label: "Tag",
      },
    },

    panel: {
      TOC: {
        label: "Outline",
      },

      INFO: {
        label: "Infomation",
        created: "Created Time",
        modified: "Modified Time",
        wordCount: "Word Count",
        charCount: "Character Count",
        readTime: "Read Time",
        editTime: "Edit Time",
        indent: "Indent",
        encoding: "Encoding",
        endOfLine: "End Of Line",
        status: "Status",
        finished: "Finished",
        unFinished: "Unfinished",
        tags: "Tags",
        picture: "Picture",
        remarks: "Remarks",
      },

      EXPORT: {
        label: "Export",
        checkGramma: "Check Gramma",
        checkReference: "Check Reference",
        openFolder: "Open Folder",
        customTheme: "Custom Theme",
        selectTheme: "Select Theme",
        executeScript: "Execute Script",
        selectScript: "Select Script",
        exportFormat: "Export Format",

        htmlTitle: "HTML Title",
        grammarSpecific: "Grammar Specific",
        pageSize: "Page Size",
        pageWidth: "Width",
        pageHeight: "Height",
        customUnit: "Custom: mm",
        direction: "Page Direction",
        vertical: "Vertical",
        horizontal: "Horizontal",
        pageMargin: "Page Margin",
        marginUnit: "Unit",
        marginTop: "Top",
        marginBottom: "Bottom",
        marginLeft: "Left",
        marginRight: "Right",

        exportButton: "Export",
      },
    },

    statusBar: {
      addTag: "Add Tag",
      deleteTag: "delete Tag",

      previewMode: "Preview Mode",
      editMode: "Edit Mode",

      WYSIWYGMode: "WYSIWYG Mode",
      sourceCodeMode: "Source Code Mode",
      sourceView: "Source View",
      columnView: "Column View",

      showPanel: "Show Panel",
      hidePanel: "Hide Panel",
      showMessages: "Show Messages",
      hideMessages: "Hide Messages",
    },
  },
};
