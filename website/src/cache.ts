import { Cache, DefaultStorage } from "@meta-ultra/cache";
const cache = new Cache({ storage: new DefaultStorage(), serializeInterval: 1000 });
export { cache };
