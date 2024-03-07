import SlIconButton from "@shoelace-style/shoelace/dist/react/icon-button/index.js";
import { useCallback, useEffect, useState } from "react";

import { useBlockConfigSetter } from "./AppContext";
import {
  useBlockStyles,
  useRenderContext,
  useRenderControls,
} from "./RenderManager";
import { BlockConfig } from "../modules/config";

export default function Block({
  id,
  config,
}: {
  id: string;
  config: BlockConfig;
}) {
  let styles = useBlockStyles(id, config);
  let [element, setElement] = useState<HTMLDivElement | null>(null);

  let setBlockConfig = useBlockConfigSetter(id);
  let renderContext = useRenderContext();

  let updateWidth = useCallback(
    async (width: number) => {
      renderContext.inFixedRendering(() => {
        setBlockConfig((previousConfig) => ({
          ...previousConfig,
          width,
        }));
      });
    },
    [renderContext, setBlockConfig],
  );

  let grow = useCallback(() => {
    updateWidth(config.width + 1);
  }, [updateWidth, config.width]);

  let shrink = useCallback(() => {
    if (config.width > 1) {
      updateWidth(config.width - 1);
    }
  }, [updateWidth, config.width]);

  let { lockRendering, unlockRendering } = useRenderControls();

  useEffect(() => {
    if (element) {
      element.addEventListener("transitionrun", lockRendering);
      element.addEventListener("transitionend", unlockRendering);

      return () => {
        element!.removeEventListener("transitionrun", lockRendering);
        element!.removeEventListener("transitionend", unlockRendering);
      };
    }

    return undefined;
  }, [element, lockRendering, unlockRendering]);

  return (
    <div className="block" style={styles} ref={setElement}>
      <div className="title">
        <h1>{config.title}</h1>
        <div className="buttons">
          <SlIconButton name="dash-circle" onClick={shrink} />
          <SlIconButton name="plus-circle" onClick={grow} />
        </div>
      </div>
      <div className="content">Hi</div>
    </div>
  );
}
