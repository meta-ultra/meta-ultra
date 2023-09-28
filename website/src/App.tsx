import { StrictMode } from "react";
import { cache } from "./cache";
import { CacheProvider } from "@meta-ultra/cache";
import User from "./User";

const App = () => {
  cache.set("message", "hi");

  return (
    <StrictMode>
      <CacheProvider cache={cache}>
        <User />
      </CacheProvider>
    </StrictMode>
  );
};

export default App;
