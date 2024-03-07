import type { AppContext } from "~/components/AppContext";

import { BlockConfig } from "./config";

export interface BlockLayout {
  id: string;
  x: number;
  y: number;
}

function* coords(
  startX: number,
  startY: number,
  width: number,
  height: number,
  columns: number,
) {
  let pos = startY * columns + startX;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      yield pos + x;
    }

    pos += columns;
  }
}

function findLayout(
  grid: boolean[],
  context: AppContext,
  blockId: string,
  block: BlockConfig,
): BlockLayout {
  let width = Math.min(block.width, context.columns);

  let startY = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let startX = 0; startX <= context.columns - width; startX++) {
      let available = true;

      let blockCoords = [
        ...coords(startX, startY, width, block.height, context.columns),
      ];

      for (let coord of blockCoords) {
        if (grid[coord]) {
          available = false;
          break;
        }
      }

      if (available) {
        for (let coord of blockCoords) {
          // eslint-disable-next-line no-param-reassign
          grid[coord] = true;
        }

        return {
          id: blockId,
          x: startX,
          y: startY,
        };
      }
    }

    startY++;
  }
}

export function initialLayout(
  context: AppContext,
  blocks: string[],
): BlockLayout[] {
  let grid: boolean[] = [];

  return blocks.map((blockId) =>
    findLayout(grid, context, blockId, context.blockConfigs[blockId]),
  );
}

export interface Metrics {
  offsetX: number;
  offsetY: number;
  columnWidth: number;
  columnGap: number;
  rowHeight: number;
  rowGap: number;
}

export function measureMetrics(): Metrics {
  let bounds = document.querySelector(".metrics")!.getBoundingClientRect();

  let col1Rect = document
    .querySelector(".metrics .col1")!
    .getBoundingClientRect();

  let col2Rect = document
    .querySelector(".metrics .col2")
    ?.getBoundingClientRect();

  let row2Rect = document
    .querySelector(".metrics .row2")!
    .getBoundingClientRect();

  return {
    offsetX: col1Rect.left - bounds.left,
    offsetY: col1Rect.top - bounds.top,
    columnWidth: col1Rect.width,
    columnGap: col2Rect ? col2Rect.left - col1Rect.right : 0,
    rowHeight: col1Rect.height,
    rowGap: row2Rect.top - col1Rect.bottom,
  };
}

export function getPosition(
  metrics: Metrics,
  x: number,
  y: number,
  width: number,
  height: number,
): React.CSSProperties {
  return {
    top: metrics.offsetY + y * (metrics.rowHeight + metrics.rowGap),
    left: metrics.offsetX + x * (metrics.columnWidth + metrics.columnGap),
    width: metrics.columnWidth * width + metrics.columnGap * (width - 1),
    height: metrics.rowHeight * height + metrics.rowGap * (height - 1),
  };
}
