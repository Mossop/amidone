import type { MetaFunction } from "@remix-run/node";

import { useBlocks, useGridDimensions } from "~/components/AppContext";
import Block from "~/components/Block";

export const meta: MetaFunction = () => [{ title: "Am I Done Yet?" }];

interface GridCssProperties extends React.CSSProperties {
  "--grid-columns": number;
  "--grid-row-height": string;
}

export default function Index() {
  let { columns, rowHeight } = useGridDimensions();
  let blocks = useBlocks();

  let style: GridCssProperties = {
    "--grid-columns": columns,
    "--grid-row-height": `${rowHeight}px`,
  };

  return (
    <main style={style}>
      <div className="blockgrid">
        {blocks.map(([id, block]) => (
          <Block key={id} id={id} config={block} />
        ))}
      </div>
    </main>
  );
}
