import { BlockConfig } from "../modules/config";
import { BlockLayout } from "~/modules/layout";

export default function Block({
  layout,
  config,
}: {
  layout: BlockLayout;
  config: BlockConfig;
}) {
  let height = config.height ?? 1;
  let width = config.width ?? 1;

  return (
    <div
      className="block"
      style={{
        gridColumnStart: layout.x + 1,
        gridColumnEnd: `span ${width}`,
        gridRowStart: layout.y + 1,
        gridRowEnd: `span ${height}`,
      }}
    >
      <div className="title">
        <h1>{config.title}</h1>
        <div className="buttons" />
      </div>
      <div className="content">Hi</div>
    </div>
  );
}
