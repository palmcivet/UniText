export const BLANK_PATTERN = /^[\s|\n]+$/g;

export interface ITocList {
  content: string;
  anchor: string;
  level: number;
  line: [number, number] | null;
}
