import type { MetaFunction } from "@remix-run/node";

import {
  useBlocks,
  useGridDimensions,
  useGridHeight,
} from "~/components/AppContext";
import Block from "~/components/Block";

export const meta: MetaFunction = () => [{ title: "Am I Done Yet?" }];

interface GridCssProperties extends React.CSSProperties {
  "--grid-columns": number;
  "--grid-rows": number;
  "--grid-height": number;
}

export default function Index() {
  let { columns, rows } = useGridDimensions();
  let blocks = useBlocks();
  let height = useGridHeight();

  let style: GridCssProperties = {
    "--grid-columns": columns,
    "--grid-rows": rows,
    "--grid-height": height,
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
