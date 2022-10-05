import { app } from "electron";
import { TMessage } from "./_";

export default {
  app: {
    system: {
      label: app.name,
      aboutApp: `关于 ${app.name}`,
      quitApp: `退出 ${app.name}`,
      checkForUpdates: "检查更新",
      services: "服务",
      hideWindow: "隐藏",
      hideOthers: "隐藏其他",
      closeWindow: "关闭窗口",
    },

    file: {
      label: "文件",
      openCabin: "打开笔记库",
      closeCabin: "关闭笔记库",
      transmitCabin: "迁移笔记库",
      addBookmark: "添加书签",
      deleteBookmark: "删除书签",
      newFile: "新建文件",
      newFolder: "新建文件夹",
      readFile: "阅读",
      editFile: "编辑",
      renameFile: "重命名",
      saveFile: "保存",
      saveFileAs: "另存为",
      revealInOs: "在文件管理器中显示",
      exportFile: "导出文档",
    },

    edit: {
      label: "编辑",
      undo: "撤销",
      redo: "重做",
      cut: "剪切",
      copy: "复制",
      paste: "粘贴",
      delete: "删除",
      selectAll: "全选",
      find: "查找",
      replace: "替换",
    },

    view: {
      label: "查看",
      fullScreen: "全屏",
      showStatusbar: "状态栏",
      showBrowser: "资源管理",
      showPanel: "侧边面板",
      togglePalette: "命令面板",
      togglePreview: "预览模式",
      toggleSource: "编辑模式",
      autoWrap: "自动折行",
      showMinimap: "显示地图",
      showSpaces: "显示空格",
    },

    format: {
      label: "格式",
      setHeadUp: "提高标题",
      setHeadDown: "降低标题",
      insertOrderedList: "有序列表",
      insertUnorderedList: "无序列表",
      insertSup: "插入上标",
      insertSub: "插入下标",
      insertImage: "插入图片",
      insertLink: "插入链接",
      insertTOC: "插入目录",
      toggleBold: "加粗",
      toggleItalic: "斜体",
      toggleMark: "高亮",
      toggleStrikethrough: "删除线",
    },

    window: {
      label: "窗口",
    },

    help: {
      label: "帮助",
      reportBugs: "报告错误",
      moreInfo: "更多信息",
      toggleDevTools: "开发者工具",
    },
  },

  context: {
    toc: {
      setHeadUp: "提高标题",
      setHeadDown: "降低标题",
      renameTitle: "更改标题",
    },

    tab: {
      closeCurrentTab: "关闭当前标签",
      closeSavedTab: "关闭已保存标签",
      closeAllTab: "关闭所有标签",
      saveAllTab: "保存所有标签",
      preview: "预览",
      pinCurrentTab: "固定标签",
    },

    file: {},

    folder: {},
  },

  dock: {
    newWindow: "新建窗口",
    newAgenda: "新建日程",
    newNote: "新建笔记",
  },

  tray: {},

  view: {
    workbench: {
      dashboard: "数据面板",
      graphview: "知识图谱",
      schedule: "计划安排",
      reminder: "每日提醒",
      setting: "用户设置",
      startup: {
        tips: "双击新建文件",
      },
    },

    browser: {
      file: {
        label: "文件管理",
        toggleFolder: "收起",
        emptyCabin: "无打开的笔记库",
        openCabin: "打开笔记库",
      },
      search: {
        label: "查找替换",
        clear: "清除筛选",
        refresh: "刷新筛选",
      },
      bookmark: {
        label: "书签管理",
      },
      tag: {
        label: "标签管理",
      },
    },

    panel: {
      TOC: {
        label: "大纲",
      },

      INFO: {
        label: "信息",
        created: "创建时间",
        modified: "更改时间",
        wordCount: "词数",
        charCount: "字数",
        readTime: "阅读时长",
        editTime: "编辑时长",
        indent: "缩进",
        encoding: "编码",
        endOfLine: "行尾序列",
        status: "状态",
        finished: "已完成",
        unFinished: "未完成",
        tags: "标签",
        picture: "图片方案",
        remarks: "备注",
      },

      EXPORT: {
        label: "导出",
        checkGramma: "执行语法检查",
        checkReference: "执行引用检查",
        openFolder: "完成后打开文件夹",
        customTheme: "自定义主题",
        selectTheme: "选择主题",
        executeScript: "完成后执行脚本",
        selectScript: "选择脚本",
        exportFormat: "导出类型",

        htmlTitle: "HTML 标题",
        grammarSpecific: "语法风格",
        pageSize: "页面大小",
        pageWidth: "宽度",
        pageHeight: "宽度",
        customUnit: "自定义：mm",
        direction: "方向",
        vertical: "纵向",
        horizontal: "横向",
        pageMargin: "页边距",
        marginUnit: "单位",
        marginTop: "上边距",
        marginBottom: "下边距",
        marginLeft: "左边距",
        marginRight: "右边距",

        exportButton: "导出",
      },
    },

    statusBar: {
      addTag: "添加标签",
      deleteTag: "删除标签",

      previewMode: "预览模式",
      editMode: "编辑模式",

      WYSIWYGMode: "WYSIWYG 模式",
      sourceCodeMode: "源码模式",
      sourceView: "源码视图",
      columnView: "分栏视图",

      showPanel: "显示侧边面板",
      hidePanel: "隐藏侧边面板",
      showMessages: "显示消息通知",
      hideMessages: "隐藏消息通知",
    },
  },
} as TMessage;
