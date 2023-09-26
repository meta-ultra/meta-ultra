const promise = Promise.resolve();
const nextTick = (fn: () => void) => promise.then(fn);
const nextEventLoop = (fn: () => void) => setTimeout(fn, 20);

export { nextTick, nextEventLoop };
