import { ReactNode, createContext, useContext, createElement } from "react";
import { Cache } from "../core";

const Context = createContext<Cache | undefined>(undefined);

const useCache = (): Cache => {
  const value = useContext(Context);
  if (value === undefined) {
    throw Error(`useCache must be inside a CacheProvider with a value`);
  }
  return value;
};

const CacheProvider = (props: { cache: Cache; children: ReactNode }) =>
  createElement(Context.Provider, { value: props.cache }, props.children);

export { useCache, CacheProvider };
