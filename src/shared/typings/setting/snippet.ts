export interface ISnippetVSCode {
  [index: string]: {
    scope: string;
    prefix: string;
    body: string | Array<string>;
    description: string;
  };
}

export interface ISnippetMonaco {
  label: string;
  command: string;
  documentation: string;
  insertText: string;
}

export interface ISnippet {
  template: Array<ISnippetMonaco>;
  fragment: Array<ISnippetMonaco>;
}
