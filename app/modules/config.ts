export interface BlockConfig {
  title: string;
  width: number;
  height: number;
}

export interface Config {
  columns: number;
  rows: number;

  blockLayout: string[];
  blocks: Record<string, BlockConfig>;
}
