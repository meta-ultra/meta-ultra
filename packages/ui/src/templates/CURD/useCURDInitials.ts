import { useState } from "react";
import { useCache } from "@meta-ultra/cache";

const useCURDInitials = (
  id: string,
  query = {},
  page = 1,
  pageSize = 10
): [Record<string, unknown>, number, number] => {
  // const cache = useJamContext();
  const cache = useCache();
  const item = cache.get(id);
  if (item) {
    const { query: q, pagination } = item as {
      query: Record<string, unknown>;
      pagination: { page: number; pageSize: number };
    };

    query = q;
    page = pagination.page;
    pageSize = pagination.pageSize;
  }
  const [initials] = useState<[Record<string, unknown>, number, number]>([
    query,
    page,
    pageSize,
  ]);

  return initials;
};

export { useCURDInitials };
