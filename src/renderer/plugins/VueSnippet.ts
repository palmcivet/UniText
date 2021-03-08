import { VueConstructor } from "vue/types/umd";

/* -------------------------- types ------------------------------- */

interface ISnippetItem {
  label: string;
  command: string;
  documentation: string;
  insertText: string;
}

interface IPluginOptions {
  base: string;
}

export interface IVueSnippet {
  readonly $snippet: Snippet;
}

/* -------------------------- class ------------------------------- */

import { join } from "path";
import * as fse from "fs-extra";
import { languages } from "monaco-editor";

export class Snippet {
  private _dataSet!: Array<ISnippetItem>;

  private _filePath!: string;

  constructor(opt: IPluginOptions) {
    this.setBasePath(opt.base);
  }

  async setBasePath(filePath: string) {
    this._filePath = join(filePath, "snippet.json");
    this._dataSet = await fse.readJSON(this._filePath);
    this._register();
  }

  async store() {
    try {
      await fse.writeJSON(this._filePath, this._dataSet);
    } catch (err) {
      // NOTE
    }
  }

  private _register() {
    languages.registerCompletionItemProvider("markdown-math", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        let snippets: languages.CompletionItem[] = [
          ...this._dataSet.map(({ command, ...item }) => {
            return {
              ...item,
              range,
              kind: languages.CompletionItemKind.Snippet,
              insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
            };
          }),
        ];

        return {
          suggestions: snippets,
        };
      },
    });
  }

  getAll() {
    return this._dataSet;
  }

  update(newData: Array<ISnippetItem>) {
    this._dataSet = newData;
    this._register();
    this.store();
  }
}

/* -------------------------- plugin ------------------------------- */

const install = (Vue: VueConstructor<Vue>, options: IPluginOptions) => {
  const proto = Vue.prototype;
  proto.$snippet = proto.$snippet || new Snippet(options);
};

export default {
  install,
};