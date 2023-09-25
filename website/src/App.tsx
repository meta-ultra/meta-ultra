import { StrictMode } from "react";
import { CacheProvider, useCache } from "@meta-ultra/cache";
import { isEmpty } from "lodash-es";
import { cache } from "./cache";

const Demo = () => {
  const cache = useCache();
  const message = cache.get<string>("message");

  return (
    <div>
      {message}
      {isEmpty([])}
    </div>
  );
};

const App = () => {
  cache.set("message", "hi");

  return (
    <StrictMode>
      <CacheProvider cache={cache}>
        <Demo />
      </CacheProvider>
    </StrictMode>
  );
};

export default App;
