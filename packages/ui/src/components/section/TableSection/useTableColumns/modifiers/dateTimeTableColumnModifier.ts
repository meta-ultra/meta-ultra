import { TableColumnType } from "antd";
import { isNil } from "lodash-es";
import { ColumnDateTime, ColumnDateTimeOption } from "../columns/ColumnDateTime/ColumnDateTime";

const dateTimeTableColumnModifier = <RecordType>(
  column: TableColumnType<RecordType> & { type?: string; format?: string }
): TableColumnType<RecordType> | undefined => {
  if (isNil(column.dataIndex) || column.type != "datetime" || isNil(column.format)) return column;

  return ColumnDateTime(column as ColumnDateTimeOption<RecordType>);
};

export { dateTimeTableColumnModifier };
