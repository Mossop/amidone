import type { MetaFunction } from "@remix-run/node";

import { useAppContext } from "~/components/AppContext";
import Block from "~/components/Block";

export const meta: MetaFunction = () => [{ title: "Am I Done Yet?" }];

export default function Index() {
  let appContext = useAppContext();

  return (
    <div
      id="gridroot"
      style={{
        gridTemplateColumns: `repeat(${appContext.columns}, 1fr)`,
        gridAutoRows: `${appContext.rowHeight}px`,
      }}
    >
      {appContext.layouts.map((blockLayout) => (
        <Block
          key={blockLayout.id}
          layout={blockLayout}
          config={appContext.blockConfigs[blockLayout.id]}
        />
      ))}
    </div>
  );
}
