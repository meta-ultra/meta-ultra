import { FC, memo, useRef, useMemo, createElement, ReactNode } from "react";

const withInitialProps = <P extends object>(
  initialPropNames: (keyof P)[],
  component: FC<P>,
  additionalInitialPropNames: (props: P) => (keyof P)[] = (props) => {
    const names = [];
    for (const name in props) {
      if (/^on[A-Z]/.test(name)) {
        names.push(name);
      }
    }

    return names;
  },
  defaults: unknown = undefined
): FC<P> => {
  type CacheType = { [name in keyof P]?: P[name] };
  const InnerComponent = memo(component);
  InnerComponent.displayName = component.displayName || component.name;

  const WrapperComponent = (props: P) => {
    initialPropNames = initialPropNames.concat(
      additionalInitialPropNames ? additionalInitialPropNames(props) : []
    );

    const cache = useRef<CacheType>(
      (() => {
        const kvs: CacheType = {};
        for (const name of initialPropNames) {
          kvs[name] = props[name];
        }
        return kvs;
      })()
    );

    const initialProps = useMemo(() => {
      const values: CacheType = {};
      for (const name of initialPropNames) {
        if (cache.current[name] === defaults) {
          cache.current[name] = props[name];
        }
        values[name] = cache.current[name];
      }

      return values;
    }, [props]);

    const mergedProps = {
      ...props,
      ...initialProps,
    } as P;

    return createElement(
      InnerComponent,
      mergedProps,
      "children" in initialProps
        ? (initialProps["children"] as ReactNode)
        : "children" in props
        ? (props["children"] as ReactNode)
        : undefined
    );
  };
  WrapperComponent.displayName = "ComponentWithInitialProps";

  return WrapperComponent;
};

export default withInitialProps;
