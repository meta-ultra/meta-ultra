import { ReactNode, useState, useEffect } from "react";

const useLoading = (
  start: boolean,
  children: ReactNode
): [boolean, ReactNode, { setLoading: typeof setLoading }] => {
  const [loading, setLoading] = useState(false);
  const [renderableChildren, setRenderableChildren] = useState<ReactNode>();

  useEffect(() => {
    if (start && children) {
      setRenderableChildren(children);
    }
  }, [start, children]);

  return [loading, renderableChildren, { setLoading }];
};

export { useLoading };
