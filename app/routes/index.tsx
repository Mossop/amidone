import type { MetaFunction } from "@remix-run/node";

import clsx from "clsx";
import { useMemo, useState } from "react";

import { useAppContext } from "~/components/AppContext";
import Block from "~/components/Block";
import { Metrics } from "~/modules/layout";

export const meta: MetaFunction = () => [{ title: "Am I Done Yet?" }];

export default function Index() {
  let appContext = useAppContext();

  let metricCells = useMemo(() => {
    let cells: string[] = [];

    cells.push("col1");
    if (appContext.columns > 1) {
      cells.push("col2");
    }
    cells.push("row2");

    return cells;
  }, [appContext.columns]);

  let [metrics] = useState<Metrics | null>(null);

  return (
    <main>
      <div
        className="metrics blockgrid"
        style={{
          gridTemplateColumns: `repeat(${appContext.columns}, 1fr)`,
          gridAutoRows: `${appContext.rowHeight}px`,
        }}
      >
        {metricCells.map((c) => (
          <div key={c} className={c} />
        ))}
      </div>
      <div
        className={clsx("blocks", metrics ? "fixed" : "blockgrid")}
        style={{
          gridTemplateColumns: `repeat(${appContext.columns}, 1fr)`,
          gridAutoRows: `${appContext.rowHeight}px`,
        }}
      >
        {appContext.layouts.map((blockLayout) => (
          <Block
            key={blockLayout.id}
            metrics={metrics}
            layout={blockLayout}
            config={appContext.blockConfigs[blockLayout.id]}
          />
        ))}
      </div>
    </main>
  );
}
