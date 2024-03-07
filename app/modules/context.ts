import { useCallback, useEffect, useState } from "react";

export abstract class BaseContext extends EventTarget {
  protected changed() {
    this.dispatchEvent(new CustomEvent("change"));
  }
}

export function useContextProperty<C extends BaseContext, R>(
  context: C,
  cb: (context: C, previous: R | undefined) => R,
): R {
  let [property, setProperty] = useState(cb(context, undefined));

  let updater = useCallback(
    () => setProperty((previous) => cb(context, previous)),
    [context, cb],
  );

  useEffect(() => {
    context.addEventListener("change", updater);

    return () => context.removeEventListener("change", updater);
  }, [context, updater]);

  return property;
}

export function contextHook<C extends BaseContext, R>(
  contextGetter: () => C,
  cb: (context: C, previous: R | undefined) => R,
): () => R {
  return () => useContextProperty(contextGetter(), cb);
}

export function contextPropertyHook<C extends BaseContext, P extends keyof C>(
  contextGetter: () => C,
  prop: P,
): () => C[P] {
  return () =>
    useContextProperty(contextGetter(), (context: C): C[P] => context[prop]);
}
