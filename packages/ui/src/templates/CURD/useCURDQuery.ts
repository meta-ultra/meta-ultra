import { useState } from "react";
import useEvent from "react-use-event-hook";
import { useCache } from "@meta-ultra/cache";

interface DataSource<RecordType> {
  data: RecordType[];
  total: number;
}

const useCURDQuery = <RecordType, QueryType = Record<string | number, unknown>>(
  id: string,
  doQuery:
    | ((
        query: QueryType,
        pagination: { page: number; pageSize: number }
      ) => Promise<DataSource<RecordType>>)
    | ((query: QueryType) => Promise<DataSource<RecordType>>)
    | (() => Promise<DataSource<RecordType>>)
): readonly [
  DataSource<RecordType>,
  (
    query: QueryType,
    pagination: { page: number; pageSize: number }
  ) => Promise<void>,
  () => void
] => {
  // const cache = useJamContext();
  const cache = useCache();
  const [dataSource, setDataSource] = useState<DataSource<RecordType>>({
    data: [],
    total: 0,
  });
  const onQuery = useEvent(
    async (
      query: QueryType,
      pagination: { page: number; pageSize: number }
    ) => {
      setDataSource(await doQuery(query, pagination));
      cache.set(id, { query, pagination });
    }
  );
  const refresh = useEvent(() => {
    const item = cache.get(id) as
      | undefined
      | { query: QueryType; pagination: { page: number; pageSize: number } };
    if (item) {
      onQuery(item.query, item.pagination);
    }
  });

  return [dataSource, onQuery, refresh] as const;
};

export { useCURDQuery };
