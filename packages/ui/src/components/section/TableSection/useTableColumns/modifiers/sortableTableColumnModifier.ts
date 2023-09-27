import { TableColumnType } from "antd";
import { isEqual, isNil } from "lodash-es";

const sortableTableColumnModifier = <RecordType>(
  column: TableColumnType<RecordType> & { sortable?: boolean }
): TableColumnType<RecordType> | undefined => {
  if (isNil(column.dataIndex) || !column.sortable) return column;

  column.sortDirections = ["ascend", "descend"];
  column.sorter = <RecordType>(
    record1: RecordType,
    record2: RecordType,
    sortOrder?: "descend" | "ascend" | null
  ) => {
    const r1 = record1[column.dataIndex as unknown as keyof RecordType];
    const r2 = record2[column.dataIndex as unknown as keyof RecordType];

    return sortOrder ? (r1 > r2 ? 1 : isEqual(r1, r2) ? 0 : -1) : 0;
  };

  return column;
};

export { sortableTableColumnModifier };
