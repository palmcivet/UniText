export interface ITocItem {
  content: string;
  anchor: string;
  level: number;
  line: [number, number] | null;
}

export interface IDisposable {
  invoke(...args: Array<any>): void;
  dispose(): void;
}
