import type { MetaFunction } from "@remix-run/node";

import { useCallback, useMemo, useState } from "react";

import {
  useAppContext,
  useBlocks,
  useGridDimensions,
} from "~/components/AppContext";
import Block, { BLOCK_DRAG_TYPE, BlockCssProperties } from "~/components/Block";

export const meta: MetaFunction = () => [{ title: "Am I Done Yet?" }];

interface GridCssProperties extends React.CSSProperties {
  "--grid-columns": number;
  "--grid-rows": number;
  "--grid-height": number;
}

function DropTarget({
  x,
  y,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  x: number;
  y: number;
  onDragEnter: (x: number, y: number) => void;
  onDragLeave: (x: number, y: number) => void;
  onDrop: (x: number, y: number) => void;
}) {
  let styles: BlockCssProperties = {
    "--block-x": x,
    "--block-y": y,
    "--block-width": 1,
    "--block-height": 1,
  };

  let dragEnter = useCallback(
    (event: React.DragEvent) => {
      let blockId = event.dataTransfer.getData(BLOCK_DRAG_TYPE);
      if (!blockId) {
        return;
      }

      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = "move";
      event.preventDefault();

      onDragEnter(x, y);
    },
    [onDragEnter, x, y],
  );

  let dragOver = useCallback((event: React.DragEvent) => {
    if (!event.dataTransfer.types.includes(BLOCK_DRAG_TYPE)) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = "move";
    event.preventDefault();
  }, []);

  let drop = useCallback(
    (event: React.DragEvent) => {
      let blockId = event.dataTransfer.getData(BLOCK_DRAG_TYPE);
      if (!blockId) {
        return;
      }

      onDrop(x, y);
    },
    [onDrop, x, y],
  );

  let dragLeave = useCallback(
    (event: React.DragEvent) => {
      let blockId = event.dataTransfer.getData(BLOCK_DRAG_TYPE);
      if (!blockId) {
        return;
      }

      onDragLeave(x, y);
    },
    [onDragLeave, x, y],
  );

  return (
    <div
      className="droptarget"
      style={styles}
      onDragEnter={dragEnter}
      onDragOver={dragOver}
      onDragLeave={dragLeave}
      onDrop={drop}
    />
  );
}

function DropTargets({
  columns,
  height,
  onDragEnter,
  onDragLeave,
  onDrop,
}: {
  columns: number;
  height: number;
  onDragEnter: (x: number, y: number) => void;
  onDragLeave: (x: number, y: number) => void;
  onDrop: (x: number, y: number) => void;
}) {
  let dropTargets = useMemo((): [string, number, number][] => {
    let targets: [string, number, number][] = [];
    let id = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < columns; x++) {
        targets.push([`target${id++}`, x, y]);
      }
    }

    return targets;
  }, [columns, height]);

  return (
    <>
      {dropTargets.map(([id, x, y]) => (
        <DropTarget
          key={id}
          x={x}
          y={y}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        />
      ))}
    </>
  );
}

export default function Index() {
  let { columns, rows, height } = useGridDimensions();
  let blocks = useBlocks();
  let [dragging, setDragging] = useState<string | null>(null);
  let context = useAppContext();

  let style: GridCssProperties = {
    "--grid-columns": columns,
    "--grid-rows": rows,
    "--grid-height": height,
  };

  let onDragStart = useCallback(
    (event: React.DragEvent) => {
      let blockId = event.dataTransfer.getData(BLOCK_DRAG_TYPE);

      if (!blockId) {
        return;
      }

      setDragging(blockId);
      context.startDragging(blockId);
    },
    [context],
  );

  let onDrop = useCallback(
    (x: number, y: number) => {
      context.drop(x, y);
    },
    [context],
  );

  let onDragEnd = useCallback(
    (event: React.DragEvent) => {
      if (!event.dataTransfer.types.includes(BLOCK_DRAG_TYPE)) {
        return;
      }

      setDragging(null);
      context.endDragging();
    },
    [context],
  );

  let onDragEnter = useCallback(
    (x: number, y: number) => {
      context.dragOver(x, y);
    },
    [context],
  );

  let onDragLeave = useCallback(
    (x: number, y: number) => {
      context.dragLeave(x, y);
    },
    [context],
  );

  return (
    <main style={style} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div key="grid" className="blockgrid">
        {blocks.map(([id, block]) => (
          <Block
            key={id}
            id={id}
            config={block}
            isDragging={dragging ? dragging == id : null}
          />
        ))}
        {dragging && (
          <DropTargets
            key="droptargets"
            columns={columns}
            height={height}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          />
        )}
      </div>
    </main>
  );
}
