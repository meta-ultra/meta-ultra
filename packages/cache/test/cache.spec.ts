import { Cache } from "../src/core/Cache";
import { CacheItem } from "../src/core/types";

let cache: Cache;
beforeEach(() => {
  cache = new Cache();
});

describe("Cache#get", () => {
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

  it("should get undefined", () => {
    const value = cache.get("undefined");
    expect(value).toBeUndefined();
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

  it("should get undefined when expired 1", () => {
    cache.set("val", false);
    let value = cache.get("val");
    expect(value).toBe(false);

    cache.set("val", false, 0);
    value = cache.get("val");
    expect(value).toBeUndefined();
  });

  it("should get undefined when expired 2", () => {
    cache.set("val", false, 1000);
    let value = cache.get("val");
    expect(value).toBe(false);

    cache.set("val", false, -1);
    value = cache.get("val");
    expect(value).toBeUndefined();
  });

  it("should get undefined when expired 3", (done) => {
    cache.set("val", false, 1000);
    const value = cache.get("val");
    expect(value).toBe(false);

    setTimeout(() => {
      const value = cache.get("val");
      try {
        expect(value).toBeUndefined();
        done();
      } catch (e) {
        done(e);
      }
    }, 1001);
  });

  it("should get false when it's not expired ", (done) => {
    cache.set("val", false, 1000);
    const value = cache.get("val");
    expect(value).toBe(false);

    setTimeout(() => {
      const value = cache.get("val");
      try {
        expect(value).toBe(false);
        done();
      } catch (e) {
        done(e);
      }
    }, 900);
  });
});

describe("Cache#set", () => {
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

  it("remove cache by set it to undefined", () => {
    cache.set("val", false);
    expect(cache.get("val")).toBe(false);

    cache.set("val", undefined);
    expect(cache.get("val")).toBeUndefined();
  });
});

describe("Cache#remove", () => {
  it("should throw an error when cache instance has been disposed", () => {
    cache.dispose();
    expect(() => {
      cache.remove("undefined");
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
      cache.remove("undefined");
    }).toThrow(Error);
  });

  it("remove", () => {
    cache.set("val", 1);
    expect(cache.get("val")).toBe(1);
    expect(cache.remove("val")).toBe(1);
    expect(cache.get("val")).toBeUndefined();
  });
});

describe("Cache#onReady", () => {
  it("execute callbacks immediately", () => {
    const fn = jest.fn();
    cache.onReady(fn);
    expect(fn).toHaveBeenCalled();
  });

  it("execute callbacks after 1000ms", (done) => {
    const storage = {
      serialize(id: string, cache: Map<string, CacheItem>): void {
        //
      },
      deserialize(id: string): Promise<Map<string, CacheItem>> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(new Map());
          }, 1000);
        });
      },
    };
    const cache = new Cache({ storage });

    const fn = jest.fn();
    cache.onReady(fn);
    expect(fn).not.toHaveBeenCalled();

    setTimeout(() => {
      try {
        expect(fn).toHaveBeenCalled();
        done();
      } catch (e) {
        done(e);
      }
    }, 2000);
  });
});
