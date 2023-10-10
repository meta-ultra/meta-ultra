import { FC } from "react";
import { renderHook, render, screen, waitFor } from "@testing-library/react";
import { Cache } from "../core/Cache";
import { CacheItem } from "../core/types";
import { useCache, CacheProvider } from "../react/CacheContext";
import { withCache } from "../react/withCache";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => jest.fn());
});
afterAll(() => {
  jest.restoreAllMocks();
});

describe("useCache", () => {
  it("should throw an error when call useCache outside CacheProvider", () => {
    expect(() => {
      renderHook(() => useCache(), {});
    }).toThrow(/^useCache must be inside a CacheProvider with a value$/);
  });

  it("should get a Cache instance", () => {
    const { result } = renderHook(() => useCache(), {
      wrapper({ children }) {
        return <CacheProvider cache={new Cache()}>{children}</CacheProvider>;
      },
    });

    expect(result.current).toBeInstanceOf(Cache);
  });
});

describe("withCache", () => {
  let WithCache: FC;
  beforeAll(() => {
    WithCache = withCache(
      () => <div data-testid="success"></div>,
      <div data-testid="fallback"></div>
    );
  });

  it("should throw an error when render component withCache outside CacheProvider", () => {
    expect(() => {
      render(<WithCache />);
    }).toThrow(/^useCache must be inside a CacheProvider with a value$/);
  });

  it("should render the internal component when cache is ready", async () => {
    render(<WithCache />, {
      wrapper({ children }) {
        return <CacheProvider cache={new Cache()}>{children}</CacheProvider>;
      },
    });

    expect(await screen.findAllByTestId("success")).toBeTruthy();
  });

  it("should render the fallback component when cache is not ready", async () => {
    render(<WithCache />, {
      wrapper({ children }) {
        const storage = {
          save(id: string, cache: Map<string, CacheItem>): void {
            //
          },
          initialize(id: string): Promise<Map<string, CacheItem>> {
            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(new Map());
              }, 1000);
            });
          },
        };
        return (
          <CacheProvider cache={new Cache({ storage })}>
            {children}
          </CacheProvider>
        );
      },
    });

    expect(await screen.findAllByTestId("fallback")).toBeTruthy();
  });
});
