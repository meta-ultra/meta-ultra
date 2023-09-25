import { Strategy } from "./enums";

interface Configuration {
  id?: string;
  maxCount?: number; // TODO
  maxSize?: number; // TODO
  strategy?: Strategy; // TODO
  storage?: Storage;
  serializeInterval?: number;
}

interface CacheItem {
  expires: Date | null;
  value: unknown;
  persistent: boolean;
}
interface Option {
  expires: number | Date;
  persistent?: boolean;
}

interface Storage {
  serialize(id: string, cache: Map<string, CacheItem>): void;
  deserialize(id: string): Promise<Map<string, CacheItem>>;
}

export type { Configuration, CacheItem, Option, Storage };
