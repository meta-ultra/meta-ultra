interface Configuration {
  id?: string;
  storage?: Storage;
  persistInterval?: number;
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
  initialize(id: string): Promise<Map<string, CacheItem>>;
  persist(id: string, cache: Map<string, CacheItem>): void;
}

export type { Configuration, CacheItem, Option, Storage };
