import type { MetaFunction } from "@remix-run/node";

import { useBlocks, useGridDimensions } from "~/components/AppContext";
import Block from "~/components/Block";
import RenderManager from "~/components/RenderManager";

export const meta: MetaFunction = () => [{ title: "Am I Done Yet?" }];

export default function Index() {
  let { columns, rowHeight } = useGridDimensions();
  let blocks = useBlocks();

  return (
    <main>
      <RenderManager>
        <div
          className="blocks blockgrid"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridAutoRows: `${rowHeight}px`,
          }}
        >
          {blocks.map(([id, block]) => (
            <Block key={id} id={id} config={block} />
          ))}
        </div>
      </RenderManager>
    </main>
  );
}
