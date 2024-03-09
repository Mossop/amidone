import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { BlockConfig, Config } from "~/modules/config";
import {
  BaseContext,
  contextHook,
  contextPropertyHook,
  useContextChange,
} from "~/modules/context";
import { BlockLayout, layout } from "~/modules/layout";

interface DragSession {
  blockId: string;
  config: BlockConfig;
  layout: BlockLayout;
  originalLayout: string[];
  x: number | null;
  y: number | null;
}

export class AppContext extends BaseContext {
  columns: number;

  rows: number;

  height: number;

  blockLayout: string[];

  layouts: Record<string, BlockLayout>;

  blockConfigs: Record<string, BlockConfig> = {};

  dragSession: DragSession | null = null;

  constructor(config?: Config) {
    super();

    this.columns = 3;
    this.rows = 4;
    this.blockLayout = [];
    this.layouts = {};
    this.height = 0;

    if (config) {
      this.setConfig(config);
    }
  }

  startDragging(blockId: string) {
    this.dragSession = {
      blockId,
      config: this.blockConfigs[blockId],
      layout: this.layouts[blockId],
      originalLayout: this.blockLayout,
      x: null,
      y: null,
    };
  }

  dragOver(x: number, y: number) {
    if (!this.dragSession) {
      return;
    }

    if (this.dragSession.x == x && this.dragSession.y == y) {
      return;
    }

    this.dragSession.x = x;
    this.dragSession.y = y;

    [this.blockLayout, this.layouts, this.height] = layout(
      this,
      this.dragSession.originalLayout,
      this.dragSession.blockId,
      {
        x: Math.min(x, this.columns - this.dragSession.config.width),
        y,
      },
    );

    this.changed();
  }

  dragLeave(x: number, y: number) {
    if (!this.dragSession) {
      return;
    }

    if (this.dragSession.x != x || this.dragSession.y != y) {
      return;
    }

    this.dragSession.x = null;
    this.dragSession.y = null;

    [this.blockLayout, this.layouts, this.height] = layout(
      this,
      this.dragSession.originalLayout,
    );

    this.changed();
  }

  drop(x: number, y: number) {
    this.dragOver(x, y);

    this.dragSession = null;
  }

  endDragging() {
    if (!this.dragSession) {
      return;
    }

    [this.blockLayout, this.layouts, this.height] = layout(
      this,
      this.dragSession.originalLayout,
    );
    this.dragSession = null;

    this.changed();
  }

  setConfig(config: Config) {
    this.columns = config.columns;
    this.rows = config.rows;

    this.blockConfigs = config.blocks;

    [this.blockLayout, this.layouts, this.height] = layout(
      this,
      config.blockLayout,
    );

    this.changed();
  }

  setBlockConfig(blockId: string, config: BlockConfig) {
    let oldConfig = this.blockConfigs[blockId];
    let newConfig = {
      ...config,
      width: Math.min(config.width, this.columns),
    };
    this.blockConfigs = {
      ...this.blockConfigs,
      [blockId]: newConfig,
    };

    if (
      oldConfig.width != newConfig.width ||
      oldConfig.height != newConfig.height
    ) {
      [this.blockLayout, this.layouts, this.height] = layout(
        this,
        this.blockLayout,
        blockId,
        this.layouts[blockId],
      );
    }

    this.changed();
  }
}

const Context = createContext<AppContext>(new AppContext());

export function useAppContext(): AppContext {
  return useContext(Context);
}

export function useBlockConfigSetter(
  blockId: string,
): Dispatch<SetStateAction<BlockConfig>> {
  let context = useAppContext();

  return useCallback(
    (config: SetStateAction<BlockConfig>) => {
      if (typeof config == "function") {
        context.setBlockConfig(blockId, config(context.blockConfigs[blockId]));
      } else {
        context.setBlockConfig(blockId, config);
      }
    },
    [blockId, context],
  );
}

export function useGridDimensions(): {
  columns: number;
  rows: number;
  height: number;
} {
  let context = useAppContext();
  useContextChange(context);

  return useMemo(
    () => ({
      columns: context.columns,
      rows: context.rows,
      height: context.height,
    }),
    [context.columns, context.rows, context.height],
  );
}

const useLayouts = contextPropertyHook(useAppContext, "layouts");

export function useBlockLayout(block: string): BlockLayout {
  let layouts = useLayouts();
  return layouts[block];
}

export const useBlocks = contextHook(useAppContext, (context) =>
  Object.entries(context.blockConfigs),
);

export default function AppContextProvider({
  config,
  children,
}: {
  config: Config;
  children: React.ReactNode;
}) {
  let [currentConfig] = useState(config);

  let context = useMemo(() => new AppContext(config), [config]);

  useEffect(() => {
    if (config !== currentConfig) {
      context.setConfig(currentConfig);
    }
  }, [config, context, currentConfig]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}
