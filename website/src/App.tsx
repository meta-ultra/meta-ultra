import { StrictMode } from "react";
import { cache } from "./cache";
import { CacheProvider } from "@meta-ultra/cache";
import User from "./User";

const App = () => {
  cache.set("message", "hi", { persistent: true, expires: 10000 });
  console.log(cache.get("message"));

  return (
    <StrictMode>
      <CacheProvider cache={cache}>
        <User />
      </CacheProvider>
    </StrictMode>
  );
};

export default App;
