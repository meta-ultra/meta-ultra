import { StrictMode } from "react";
import { AiFillAccountBook } from "react-icons/ai";
import { CacheProvider, useCache } from "@meta-ultra/cache";
import { LinkDeleteButton } from "@meta-ultra/ui";
import { cache } from "./cache";

const Demo = () => {
  const cache = useCache();
  const message = cache.get<string>("message");

  return (
    <div>
      {message}
      <LinkDeleteButton text="删除" />
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
