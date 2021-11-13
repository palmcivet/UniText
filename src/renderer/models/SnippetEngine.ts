import { languages } from "monaco-editor";

interface ISnippetItem {
  label: string;
  command: string;
  documentation: string;
  insertText: string;
}

export default class Snippet {
  private _dataSet!: Array<ISnippetItem>;

  constructor(base: string) {}

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

  update(newData: Array<ISnippetItem>) {
    this._dataSet = newData;
    this._register();
  }
}
