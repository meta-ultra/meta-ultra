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

### The `Cache` class

- Constructor `new Cache(configuration: Configuration)`
  - The `Configuration` type
    - `id` defaults to `MetaUltra`, it's used to identify the project
    - `maxCount` wait to implement
    - `maxSize` wait to implement
    - `strategy` wait to implement
    - `storage` specify where to persist on
    - `serializeInteral` work with `storage`, specify how long to save the serialized cache to the store in milliseconds.
- `onReady(cb: () => void)` the callback function would be invoked when the cache instance has initialized.
- `get<R>(key: string): undefined | R` get value from cache
- `set(key: string, value: unknown, option?: Option | number): void` set a value in cache
- `remove(key: string)` remove a entry from cache
- `dispose()` destroy the cache

### The `DefaultStorage` class

It save the cache in the LocalStorage under the hood.
