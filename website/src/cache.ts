import { Cache, WebStorage } from "@meta-ultra/cache";

const cache = new Cache({ storage: new WebStorage(), persistInterval: 1000 });
export { cache };
