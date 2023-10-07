import { Cache } from "../src/core/Cache";
import { CacheItem } from "../src/core/types";

describe("Cache", () => {
  let cache: Cache;
  beforeEach(() => {
    cache = new Cache();
  });

  it("should get undefined", () => {
    const value = cache.get("undefined");
    expect(value).toBeUndefined();
  });

  it("should throw an error when cache instance has been disposed", () => {
    cache.dispose();
    expect(() => {
      cache.get("undefined");
    }).toThrow(Error);
  });

  it("should throw an error when cache instance is initializing", () => {
    const storage = {
      serialize(id: string, cache: Map<string, CacheItem>): void {
        //
      },
      deserialize(id: string): Promise<Map<string, CacheItem>> {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      },
    };
    const cache = new Cache({ storage });
    expect(() => {
      cache.get("undefined");
    }).toThrow(Error);
  });

  it("should get number 1", () => {
    cache.set("val", 1);
    const value = cache.get("val");
    expect(value).toBe(1);
  });

  it("should get boolean false", () => {
    cache.set("val", false);
    const value = cache.get("val");
    expect(value).toBe(false);
  });

  it("should get undefined when expired", () => {
    cache.set("val", false);
    let value = cache.get("val");
    expect(value).toBe(false);

    cache.set("val", false, 0);
    value = cache.get("val");
    expect(value).toBeUndefined();
  });

  it("should throw an error when cache instance has been disposed", () => {
    cache.dispose();
    expect(() => {
      cache.set("undefined", 1);
    }).toThrow(Error);
  });

  it("should throw an error when cache instance is initializing", () => {
    const storage = {
      serialize(id: string, cache: Map<string, CacheItem>): void {
        //
      },
      deserialize(id: string): Promise<Map<string, CacheItem>> {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      },
    };
    const cache = new Cache({ storage });

    expect(() => {
      cache.set("undefined", 1);
    }).toThrow(Error);
  });
});
