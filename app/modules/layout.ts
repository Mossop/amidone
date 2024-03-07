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
