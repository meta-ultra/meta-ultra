interface Authorize {
  (path: string): Promise<boolean>;
}

interface AuthMeta {
  authorize?: Authorize;
}

export type { Authorize, AuthMeta };
