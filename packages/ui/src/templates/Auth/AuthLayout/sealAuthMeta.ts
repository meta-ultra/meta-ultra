import makeSuspender, { type Suspender } from "./makeSuspender";
import type { AuthMeta } from "./AuthMeta";

interface SingleThreadAuthorize {
  (path: string): unknown;
  suspender?: Suspender;
}

interface SealedAuthMeta {
  authorize?: SingleThreadAuthorize;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sealAuthMeta = (meta?: AuthMeta): SealedAuthMeta => {
  const sealedAuthMeta: SealedAuthMeta = {};

  if (meta && meta.authorize) {
    const authorize = meta.authorize;
    const singleThreadAuthorize: SingleThreadAuthorize = (path: string) => {
      if (!singleThreadAuthorize.suspender) {
        const promiseInstance = authorize(path).then((value) => {
          if (value) {
            return value;
          } else {
            //* Throw an ErrorResponse like error instance, which will be thrown by react-router-dom v6 when there's no route matching expected URL.
            throw {
              status: 404,
              statusText: "Not Found",
              data: `Error: No route matches URL "${path}"`,
              error: Error(`Error: No route matches URL "${path}"`),
            };
          }
        });
        singleThreadAuthorize.suspender = makeSuspender(promiseInstance, async () => {
          //! IMPORTANT: Hold the thread until the next round of event loop to avoid endless loop.
          await sleep(16);
          singleThreadAuthorize.suspender = undefined;
        });
      }

      const result = singleThreadAuthorize.suspender.read();
      return result;
    };

    sealedAuthMeta.authorize = singleThreadAuthorize;
  }

  return sealedAuthMeta;
};

export type { SealedAuthMeta };
export default sealAuthMeta;
