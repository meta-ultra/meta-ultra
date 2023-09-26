function isPromiseLike<T>(it: T | PromiseLike<T>): it is PromiseLike<T> {
  return it instanceof Promise || typeof (it as { then: unknown })?.then === "function";
}

export { isPromiseLike };
