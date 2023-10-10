import { Status } from "./enums";
import { CacheItem, Configuration, Option } from "./types";

class Cache {
  public readonly id: string;
  private status: Status = Status.INITIALIZING;
  private cbs: (() => void)[] & { fd?: ReturnType<typeof setTimeout> } = [];
  private cache: Map<string, CacheItem> | null = new Map<string, CacheItem>();
  private disposes: (() => void)[] = [];

  constructor(private config?: Configuration) {
    this.id = (config && config.id) || "MetaUltra";
    this.saveBeforeUnload();
    this.savePeriodically();
    this.initialize();
  }

  private saveBeforeUnload(): void {
    if (this.config && this.config.storage) {
      const handler = () => {
        this.cache &&
          this.config &&
          this.config.storage &&
          this.config.storage.save(this.id, this.cache);
      };
      window.addEventListener("beforeunload", handler);

      this.disposes.push(() => {
        window.removeEventListener("beforeunload", handler);
      });
    }
  }

  private savePeriodically(): void {
    if (this.config && this.config.serializeInterval && this.config.storage) {
      const hd = setInterval(() => {
        this.cache &&
          this.config &&
          this.config.storage &&
          this.config.storage.save(this.id, this.cache);
      }, this.config.serializeInterval);

      this.disposes.push(() => {
        clearInterval(hd);
      });
    }
  }

  private initialize(): void {
    if (this.config && this.config.storage) {
      (async () => {
        if (this.cache && this.config && this.config.storage) {
          this.cache = await this.config.storage.initialize(this.id);
          this.status = Status.IDLE;
        } else {
          this.status = Status.IDLE;
        }
      })();
    } else {
      this.status = Status.IDLE;
    }
  }

  dispose() {
    this.cache = null;
    this.disposes.forEach((dispose) => dispose());
  }

  onReady(cb: () => void) {
    this.cbs.push(cb);
    const invokeCallbacks = () => {
      while (this.cbs.length) {
        const cb = this.cbs.shift();
        if (cb) {
          try {
            cb();
          } catch (e) {
            // ignore e
          }
        }
      }
    };

    if (this.status === Status.IDLE) {
      clearTimeout(this.cbs.fd);
      invokeCallbacks();
    } else {
      const handle = () => {
        clearTimeout(this.cbs.fd);
        if (this.status === Status.IDLE) {
          invokeCallbacks();
        } else if (this.cache) {
          // TODO: unify the disposition implementation
          this.cbs.fd = setTimeout(handle, 16);
        }
      };
      handle();
    }
  }

  get<R = unknown>(key: string): undefined | R {
    if (this.cache === null) {
      throw Error(`[${this.id}] Cache instance has been disposed.`);
    }
    if (this.status === Status.INITIALIZING) {
      if (process.env.NODE_ENV === "test") {
        throw Error(`[${this.id}] Cache instance is still initializing`);
      } else {
        console.warn(`[${this.id}] Cache instance is still initializing`);
        return undefined;
      }
    }

    const item = this.cache.get(key);
    if (item) {
      if (item.expires == null || item.expires > new Date()) {
        return item.value as R;
      } else {
        this.cache.delete(key);
      }
    }

    return undefined;
  }

  set(key: string, value: unknown, option?: Option | number): void {
    if (this.cache === null) {
      throw Error(`[${this.id}] This cache instance has been disposed.`);
    }
    if (this.status === Status.INITIALIZING) {
      if (process.env.NODE_ENV === "test") {
        throw Error(`[${this.id}] Cache instance is still initializing`);
      } else {
        console.warn(`[${this.id}] Cache instance is still initializing`);
        return undefined;
      }
    }

    if (value === undefined) {
      this.cache.delete(key);
    }

    const item =
      this.cache.get(key) ||
      ({
        expires: undefined,
        value: undefined,
        persistent: false,
      } as Partial<CacheItem>);

    let expires: null | Date = null;
    let persistent = false;
    if (option !== undefined) {
      if (typeof option === "number") {
        expires = new Date(+new Date() + option);
      } else {
        if (typeof option.expires === "number") {
          expires = new Date(+new Date() + option.expires);
        } else {
          expires = option.expires;
        }

        persistent = !!option.persistent;
      }
    }

    if (expires === null || expires > new Date()) {
      item.value = value;
      item.expires = expires;
      item.persistent = persistent;
      this.cache.set(key, item as CacheItem);
    } else {
      this.cache.delete(key);
    }
  }

  remove<R = unknown>(key: string | string[]): R | undefined | Array<unknown> {
    if (this.cache === null) {
      throw Error(`[${this.id}] This cache instance has been disposed.`);
    }
    if (this.status === Status.INITIALIZING) {
      if (process.env.NODE_ENV === "test") {
        throw Error(`[${this.id}] Cache instance is still initializing`);
      } else {
        console.warn(`[${this.id}] Cache instance is still initializing`);
        return undefined;
      }
    }

    const stales: Array<unknown> = [];
    const keys = typeof key === "string" ? [key] : key;
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (key) {
        const stale = this.get(key);
        stales.push(stale);
        if (stale !== undefined) {
          this.cache.delete(key);
        }
      }
    }

    if (typeof key === "string") {
      return stales[0] as R | undefined;
    } else {
      return stales;
    }
  }
}

export { Cache };
