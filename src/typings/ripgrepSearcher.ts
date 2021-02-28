declare interface IRipgrepThenable<T> extends Promise<T> {
  cancel(): void;
}

declare interface IRipgrepOptions {
  didMatch: (searchResult: IRipgrepSearchResult) => void;
  didSearchPaths: (numPathsFound: number) => void;
  inclusions: Array<string>;
  exclusions: Array<string>;
  isRegexp?: boolean;
  isWholeWord?: boolean;
  isCaseSensitive?: boolean;
  followSymlinks?: boolean;
  maxFileSize?: number;
  includeHidden?: boolean;
  noIgnore?: boolean;
  leadingContextLineCount?: number;
  trailingContextLineCount?: number;
}

export declare interface IRipgrepSearchResult {
  filePath: string;
  matches: Array<{
    leadingContextLines: number;
    trailingContextLines: number;
    lineText: string;
    matchText: string;
    range: Array<[number, number]>;
  }>;
}

declare class RipgrepDirectorySearcher {
  constructor(dir: string);

  search(
    directory: Array<string>,
    pattern: string,
    options: IRipgrepOptions
  ): IRipgrepThenable<any>;

  searchInDirectory(
    directoryPath: Array<string>,
    pattern: string,
    options: IRipgrepOptions,
    numPathsFound: { num: number }
  ): IRipgrepThenable<any>;
}

export default RipgrepDirectorySearcher;
