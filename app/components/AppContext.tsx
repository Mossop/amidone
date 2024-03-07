import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { BlockConfig, Config } from "~/modules/config";
import { BaseContext } from "~/modules/context";
import { BlockLayout, initialLayout } from "~/modules/layout";

export class AppContext extends BaseContext {
  columns: number;

  rowHeight: number;

  layouts: BlockLayout[];

  blockConfigs: Record<string, BlockConfig> = {};

  constructor(config?: Config) {
    super();

    this.columns = 3;
    this.rowHeight = 200;
    this.layouts = [];

    if (config) {
      this.setConfig(config);
    }
  }

  setConfig(config: Config) {
    this.columns = config.columns;
    this.rowHeight = config.rowHeight;

    this.blockConfigs = config.blocks;

    this.layouts = initialLayout(this, config.blockLayout);

    this.changed();
  }
}

const Context = createContext<AppContext>(new AppContext());

export function useAppContext(): AppContext {
  return useContext(Context);
}

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
