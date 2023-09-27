import { TableColumnType } from "antd";
import { isNil } from "lodash-es";
import { ColumnStatus, ColumnStatusOption } from "../columns/ColumnStatus/ColumnStatus";

const statusTableColumnModifier = <RecordType>(
  column: TableColumnType<RecordType> & { type?: string; format?: string }
): TableColumnType<RecordType> | undefined => {
  if (isNil(column.dataIndex) || column.type != "status") return column;

  return ColumnStatus(column as ColumnStatusOption<RecordType>);
};

export { statusTableColumnModifier };
