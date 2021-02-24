export interface ITocList {
  content: string;
  anchor: string;
  level: number;
  line: [number, number] | null;
}
