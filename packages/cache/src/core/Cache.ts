import { Status } from "./enums";
import { CacheItem, Configuration, Option } from "./types";

class Cache {
  public readonly id: string;
  private status: Status = Status.INITIALIZING;
  private cbs: (() => void)[] & { fd?: ReturnType<typeof setTimeout> } = [];
  private parent?: Cache;
  private cache: Map<string, CacheItem> | null = new Map<string, CacheItem>();
  private disposes: (() => void)[] = [];

  constructor(private config?: Configuration) {
    this.id = (config && config.id) || "MetaPro";
    this.serializeBeforeUnload();
    this.serializeInterval();
    this.deserialize();
  }

  serializeBeforeUnload(): void {
    if (this.config && this.config.storage) {
      const handler = () => {
        this.cache &&
          this.config &&
          this.config.storage &&
          this.config.storage.serialize(this.id, this.cache);
      };
      window.addEventListener("beforeunload", handler);

      this.disposes.push(() => {
        window.removeEventListener("beforeunload", handler);
      });
    }
  }

  serializeInterval(): void {
    if (this.config && this.config.serializeInterval && this.config.storage) {
      const hd = setInterval(() => {
        this.cache &&
          this.config &&
          this.config.storage &&
          this.config.storage.serialize(this.id, this.cache);
      }, this.config.serializeInterval);

      this.disposes.push(() => {
        clearInterval(hd);
      });
    }
  }

  deserialize(): void {
    if (this.config && this.config.storage) {
      (async () => {
        if (this.cache && this.config && this.config.storage) {
          this.cache = await this.config.storage.deserialize(this.id);
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
      throw Error(`[${this.id}] This cache instance has been disposed.`);
    }
    if (this.status === Status.INITIALIZING) {
      return undefined;
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
      return undefined;
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

  remove(key: string): void {
    if (this.cache === null) {
      throw Error(`[${this.id}] This cache instance has been disposed.`);
    }
    if (this.status === Status.INITIALIZING) {
      return undefined;
    }

    this.cache.delete(key);
  }
}

export { Cache };
