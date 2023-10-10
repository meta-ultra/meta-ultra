import { CacheItem, Storage } from "../packages/cache/src/core/types";
import { isEmpty } from "lodash-es";
import { getStorage, removeStorage, setStorage } from "@tarojs/taro";

type Month1 = `0${Exclude<number, 0>}`;
type Month2 = `1${0 | 1 | 2}`;

class TaroStorage implements Storage {
  #baseDateTime: number;

  constructor(
    baseYearMonth: `${Exclude<number, 0>}${number}${number}${number}/${
      | Month1
      | Month2}` = "2023/08"
  ) {
    this.#baseDateTime = +new Date(`${baseYearMonth}/01`);
  }

  async initialize(id: string): Promise<Map<string, CacheItem>> {
    const curr = new Date();
    const cache = new Map<string, CacheItem>();
    const { data: item } = await getStorage({ key: id });
    const kvs = item === null ? null : JSON.parse(item);
    if (typeof kvs === "object" && !isEmpty(kvs)) {
      for (const key in kvs) {
        const value = kvs[key];
        const [name, strExpires] = key.split("-");
        let expires: Date | null = null;
        if (name === undefined) continue;
        if (strExpires && !isNaN(Number(strExpires))) {
          expires = new Date(this.#baseDateTime + Number(strExpires));
          if (expires <= curr) {
            continue;
          }
        }

        cache.set(name, {
          expires,
          value,
          persistent: true,
        });
      }
    }

    return cache;
  }

  persist(id: string, cache: Map<string, CacheItem>): void {
    const curr = new Date();
    const kvs: Record<string, unknown> = {};
    for (const [name, item] of cache.entries()) {
      if (item.persistent && (item.expires as Date) > curr) {
        const key = [
          name,
          item.expires !== null
            ? String(+item.expires - this.#baseDateTime)
            : "",
        ].join("-");
        const value = item.value;

        kvs[key] = value;
      }
    }
    if (isEmpty(kvs)) {
      removeStorage({ key: id });
    } else {
      setStorage({
        key: id,
        data: JSON.stringify(kvs),
      });
    }
  }
}

export default TaroStorage;
