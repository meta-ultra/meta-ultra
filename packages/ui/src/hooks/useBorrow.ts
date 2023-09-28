import { useRef, useMemo } from "react";

const useBorrow = (
  kvs: Record<string, unknown>
): [Record<string, unknown>, (key: string) => boolean] => {
  const borrowStatusRef = useRef<Record<string, boolean>>({});
  const context = useMemo(() => {
    const context = {};
    for (const [key, value] of Object.entries(kvs)) {
      Object.defineProperty(context, key, {
        get() {
          borrowStatusRef.current[key] = true;
          return value;
        },
      });
    }

    return context;
  }, [kvs]);
  const isBorrowed = useMemo(
    () => (key: string) => {
      return !!borrowStatusRef.current[key];
    },
    []
  );

  return [context, isBorrowed];
};

export default useBorrow;
