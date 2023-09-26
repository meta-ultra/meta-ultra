import React from "react";

const createContext = <A extends unknown | null>(useContextName: string) => {
  const Context = React.createContext<A | undefined>(undefined);
  const useContext = () => {
    const value = React.useContext(Context);
    if (value === undefined) {
      throw Error(`${useContextName} must be inside a Provider with a value`);
    }
    return value;
  };

  return [useContext, Context.Provider] as const;
};

export { createContext };
