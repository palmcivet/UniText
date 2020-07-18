import { IArticle } from "../../interfaces/article";

interface IEditor {
  fileCurrent: IArticle;
  fileGroup: Array<IArticle> | [];
}

const initState = () => ({
  fileCurrent: {
    title: "Untitled",
    metaInfo: {
      createDate: new Date(),
      modifyDate: new Date(),
      wordCount: 0,
      charCount: 0,
      duration: 0,
    },
    attribute: {
      tagName: "Untaged",
      comment: "",
      picStorage: "",
      isAutoSave: false,
      isAutoSync: false,
      isComputed: false,
    },
    editor: {
      indent: 2,
      encoding: "utf-8",
      endOfLine: "LF",
    },
    content: "",
  },
  fileGroup: [],
});

const getters = {
  getTitle: (state: IEditor) => {
    return state.fileCurrent !== null ? state.fileCurrent.title : "";
  },
};

const mutations = {
  setTitle: (state: IEditor, title: string) => {
    state.fileCurrent.title = title;
  },
};

const actions = {};

export default {
  state: initState,
  getters,
  mutations,
  actions,
};
