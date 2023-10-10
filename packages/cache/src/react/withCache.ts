import {
  ComponentType,
  FC,
  useState,
  createElement,
  ReactNode,
  ReactElement,
  useEffect,
} from "react";
import { useCache } from "./CacheContext";

const withCache = (
  Component: ComponentType,
  fallback: ReactElement | null = null
): FC => {
  const ComponentWithCache = <P extends object>(props: P) => {
    const [ready, setReady] = useState(false);
    const cache = useCache();
    useEffect(() => {
      cache.onReady(() => setReady(true));
    }, [cache]);

    return ready
      ? createElement(
          Component,
          props,
          (props as { children: ReactNode })["children"]
        )
      : fallback;
  };
  ComponentWithCache.displayName =
    (Component.displayName || Component.name || "Component") + `WithCache`;

  return ComponentWithCache;
};

export default withCache;
