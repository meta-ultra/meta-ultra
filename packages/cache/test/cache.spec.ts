import { Cache } from "../src/core/Cache";

describe("Cache", () => {
  let cache: Cache;
  beforeEach(() => {
    cache = new Cache();
  });

  it("should get undefined", () => {
    const value = cache.get("undefined");
    expect(value).toBeUndefined();
  });

  it("should throw an error", () => {
    cache.dispose();
    expect(() => {
      cache.get("undefined");
    }).toThrow(Error);
  });
});
