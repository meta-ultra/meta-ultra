import { useRef, useLayoutEffect, useCallback } from "react";

const useEvent = <F extends (...args: any[]) => any>(handler: F) => {
  const ref = useRef<F>();
  useLayoutEffect(() => {
    ref.current = handler;
  });

  return useCallback((...args: any[]) => ref.current?.call(null, ...args), []);
};

export default useEvent;
