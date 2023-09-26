import { useEffect, useState } from "react";
import { throttle } from "lodash-es";

type Listener = (width: number, height: number) => void;

const listeners: Map<symbol, Listener> = new Map();

const detectWindowResize: { (): void; dispose?: () => void } = () => {
  if (detectWindowResize.dispose) return;

  const handler = throttle(() => {
    for (const listener of listeners.values()) {
      listener(window.innerWidth, window.innerHeight);
    }
  }, 300);
  window.addEventListener("resize", handler);

  detectWindowResize.dispose = () => {
    if (listeners.size) return;

    window.removeEventListener("resize", handler);
    detectWindowResize.dispose = undefined;
  };
};

const useWindowResize = (initialValue?: { width: number; height: number }) => {
  const [dimensions, setDimensions] = useState(
    initialValue ?? { width: window.innerWidth, height: window.innerHeight }
  );

  useEffect(() => {
    const id = Symbol();
    listeners.set(id, (width: number, height: number) => {
      setDimensions({ width, height });
    });
    detectWindowResize();

    return () => {
      listeners.delete(id);
      detectWindowResize.dispose && detectWindowResize.dispose();
    };
  }, []);

  return dimensions;
};

export { useWindowResize };
