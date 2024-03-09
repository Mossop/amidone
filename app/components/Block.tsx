import SlIcon from "@shoelace-style/shoelace/dist/react/icon/index.js";
import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button/index.js";
import { useCallback, useRef } from "react";

import { useBlockConfigSetter, useBlockLayout } from "./AppContext";
import { BlockConfig } from "../modules/config";

export const BLOCK_DRAG_TYPE = "block/id";

export interface BlockCssProperties extends React.CSSProperties {
  "--block-x": number;
  "--block-y": number;
  "--block-width": number;
  "--block-height": number;
}

export default function Block({
  id,
  config,
}: {
  id: string;
  config: BlockConfig;
}) {
  let blockElement = useRef<HTMLDivElement | null>(null);
  let setBlockConfig = useBlockConfigSetter(id);

  let updateWidth = useCallback(
    (width: number) => {
      setBlockConfig((previousConfig) => ({
        ...previousConfig,
        width,
      }));
    },
    [setBlockConfig],
  );

  let grow = useCallback(() => {
    updateWidth(config.width + 1);
  }, [updateWidth, config.width]);

  let shrink = useCallback(() => {
    if (config.width > 1) {
      updateWidth(config.width - 1);
    }
  }, [updateWidth, config.width]);

  let layout = useBlockLayout(id);
  let styles: BlockCssProperties = {
    "--block-x": layout.x,
    "--block-y": layout.y,
    "--block-width": config.width,
    "--block-height": config.height,
  };

  let dragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData(BLOCK_DRAG_TYPE, id);

      if (blockElement.current) {
        event.dataTransfer.setDragImage(blockElement.current, 0, 0);
      }
    },
    [id],
  );

  return (
    <div className="block" style={styles} ref={blockElement}>
      <div className="header">
        <div className="title">
          <div className="dragHandle" draggable onDragStart={dragStart}>
            <SlIcon name="grip-vertical" />
          </div>
          <h1>{config.title}</h1>
        </div>
        <div className="buttons">
          <SlIconButton name="dash-circle" onClick={shrink} />
          <SlIconButton name="plus-circle" onClick={grow} />
        </div>
      </div>
      <div className="content">Hi</div>
    </div>
  );
}
