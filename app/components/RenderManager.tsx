import { createContext, useContext, useEffect, useMemo } from "react";

import { useBlockLayout, useGridDimensions } from "./AppContext";
import { BlockConfig } from "~/modules/config";
import { BaseContext, contextPropertyHook } from "~/modules/context";
import { Metrics, getPosition, measureMetrics } from "~/modules/layout";

function promiseTimeout(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

class RenderContext extends BaseContext {
  metrics: Metrics | null = null;

  locks = 0;

  pendingRender: (() => void) | null = null;

  waitForRender() {
    return new Promise<void>((resolve) => {
      this.pendingRender = resolve;
      this.changed();
    });
  }

  async inFixedRendering(cb: () => void) {
    this.locks++;

    if (!this.metrics) {
      console.log("Enter fixed rendering");
      this.metrics = measureMetrics();
      this.changed();
      await promiseTimeout(100);
    }

    try {
      cb();
    } finally {
      this.unlockFixedRendering();
    }
  }

  lockFixedRendering() {
    console.log("Lock render");
    this.locks++;
  }

  async unlockFixedRendering() {
    if (this.locks == 0) {
      throw new Error("Unexpected unlock outside of fixed rendering");
    }

    console.log("Unlock render");
    this.locks--;

    await promiseTimeout(500);

    if (this.locks == 0) {
      console.log("Fully unlocked");
      this.metrics = null;
      this.changed();
    }
  }
}

const Context = createContext(new RenderContext());

export function useRenderContext() {
  return useContext(Context);
}

const useMetrics = contextPropertyHook(useRenderContext, "metrics");

export function useRenderControls(): {
  lockRendering: () => void;
  unlockRendering: () => void;
} {
  let context = useRenderContext();

  return useMemo(
    () => ({
      lockRendering: () => context.lockFixedRendering(),
      unlockRendering: () => context.unlockFixedRendering(),
    }),
    [context],
  );
}

export function useBlockStyles(
  blockId: string,
  config: BlockConfig,
): React.CSSProperties {
  let metrics = useMetrics();
  let layout = useBlockLayout(blockId);

  if (metrics) {
    return {
      ...getPosition(metrics, layout.x, layout.y, config.width, config.height),
      position: "absolute",
    };
  }

  return {
    gridColumnStart: layout.x + 1,
    gridColumnEnd: `span ${config.width}`,
    gridRowStart: layout.y + 1,
    gridRowEnd: `span ${config.height}`,
  };
}

const usePendingRender = contextPropertyHook(useRenderContext, "pendingRender");

function MetricsGrid() {
  let { columns, rowHeight } = useGridDimensions();

  let metricCells = useMemo(() => {
    let cells: string[] = [];

    cells.push("col1");
    if (columns > 1) {
      cells.push("col2");
    }
    cells.push("row2");

    return cells;
  }, [columns]);

  let pendingRender = usePendingRender();

  useEffect(() => {
    if (pendingRender) {
      pendingRender();
    }
  }, [pendingRender]);

  return (
    <div
      className="metrics blockgrid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: `${rowHeight}px`,
      }}
    >
      {metricCells.map((c) => (
        <div key={c} className={c} />
      ))}
    </div>
  );
}

export default function RenderManager({
  children,
}: {
  children: React.ReactNode;
}) {
  let context = useMemo(() => new RenderContext(), []);

  return (
    <Context.Provider value={context}>
      <MetricsGrid />
      {children}
    </Context.Provider>
  );
}
