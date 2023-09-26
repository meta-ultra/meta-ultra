import { Key } from "react";

// The value of key assigned to ComponentType would result in that prefixed with ".$" or "0:.$.$.$" etc. as the key for instantiated ReactElement.
const getPureKey = (key: Key | null) => (key ? String(key).replace(/.*?([^$]+)$/, "$1") : key);

export { getPureKey };
