import type { AppContext } from "~/components/AppContext";

import { BlockConfig } from "./config";

type Grid = string[];

export interface BlockLayout {
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
  grid: Grid,
  columns: number,
  blockId: string,
  block: BlockConfig,
): BlockLayout {
  let width = Math.min(block.width, columns);

  let startY = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    for (let startX = 0; startX <= columns - width; startX++) {
      let available = true;

      let blockCoords = [
        ...coords(startX, startY, width, block.height, columns),
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
          grid[coord] = blockId;
        }

        return {
          x: startX,
          y: startY,
        };
      }
    }

    startY++;
  }
}

export function layout(
  context: AppContext,
  blocks: string[],
  fixedBlock?: string,
  fixedLayout?: BlockLayout,
): [string[], Record<string, BlockLayout>] {
  let layouts: Record<string, BlockLayout> = {};
  let grid: Grid = [];

  if (fixedBlock && fixedLayout) {
    layouts[fixedBlock] = fixedLayout;
    let config = context.blockConfigs[fixedBlock];

    for (let coord of coords(
      fixedLayout.x,
      fixedLayout.y,
      config.width,
      config.height,
      context.columns,
    )) {
      grid[coord] = fixedBlock;
    }
  }

  for (let blockId of blocks) {
    layouts[blockId] = findLayout(
      grid,
      context.columns,
      blockId,
      context.blockConfigs[blockId],
    );
  }

  let ids = new Set<string>();
  let coord = 0;
  let seenBlock = true;
  while (seenBlock) {
    seenBlock = false;

    for (let x = 0; x < context.columns; x++) {
      if (grid[coord + x]) {
        ids.add(grid[coord + x]);
        seenBlock = true;
      }
    }

    coord += context.columns;
  }

  if (fixedBlock) {
    return layout(context, [...ids]);
  }
  return [[...ids], layouts];
}
