# Meta Ultra Cache

A strong and boost cache module belongs to Meta Ultra versatile solution.

## Setup

- Using npm `npm i @meta-ultra/cache`
- Using yarn `yarn add @meta-ultra/cache`
- Using pnpm `pnpm add @meta-ultra/cache`

## Usage

1. Create a singleton cache instance across the application

   ```ts
   // in file `./src/cache.ts`
   import { Cache, DefaultStorage } from "@meta-ultra/cache"

   const cache = new Cache({
     storage: new DefaultStorage(),
     serializeInterval: 1000 // persist the serialized cache content every 1000 milliseconds.
   })

   export default cache
   ```

2. Setup the cache context

   ```tsx
   // in file `./src/App.tsx`
   import { CacheProvider } from "@meta-ultra/cache";
   import cache from "./cache";
   import Page from "./Page"

   const App = () => {
     return (
       <CacheProvider cache={cache}>
         <Page />
       </CacheProvider>
     );
   };
   ```

3. Access the cache instance inside the nested components

   ```tsx
   // in file `./src/Page.tsx`
   import { useCache } from "@meta-ultra/cache";

   const Page = () => {
     const cache = useCache()
     return <div>{cache.get("text")}</div>
   }
   ```

## API

-
