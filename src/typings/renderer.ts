declare interface ITocItem {
  content: string;
  anchor: string;
  level: number;
  line: [number, number] | null;
}
