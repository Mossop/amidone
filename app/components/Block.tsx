import { useMemo } from "react";

import { BlockConfig } from "../modules/config";
import { BlockLayout, Metrics, getPosition } from "~/modules/layout";

export default function Block({
  layout,
  config,
  metrics,
}: {
  layout: BlockLayout;
  config: BlockConfig;
  metrics?: Metrics | null;
}) {
  let styles = useMemo((): React.CSSProperties => {
    if (metrics) {
      return getPosition(
        metrics,
        layout.x,
        layout.y,
        config.width,
        config.height,
      );
    }

    return {
      gridColumnStart: layout.x + 1,
      gridColumnEnd: `span ${config.width}`,
      gridRowStart: layout.y + 1,
      gridRowEnd: `span ${config.height}`,
    };
  }, [layout, config, metrics]);

  return (
    <div className="block" style={styles}>
      <div className="title">
        <h1>{config.title}</h1>
        <div className="buttons" />
      </div>
      <div className="content">Hi</div>
    </div>
  );
}
