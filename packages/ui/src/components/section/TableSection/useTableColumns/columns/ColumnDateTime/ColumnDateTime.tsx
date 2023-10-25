import { TableColumnType } from "antd";
import dayjs from "dayjs";

interface ColumnDateTimeOption<RecordType> extends TableColumnType<RecordType> {
  format: string;
}

const ColumnDateTime = <RecordType,>(option: ColumnDateTimeOption<RecordType>) => ({
  ...option,
  render(dateTime: unknown, record: RecordType, index: number) {
    const result =
      typeof dateTime === "string" || dateTime instanceof Date
        ? dayjs(dateTime as string | Date).format(option.format)
        : dateTime;
    return option.render ? option.render(result, record, index) : result;
  },
});

export type { ColumnDateTimeOption };
export { ColumnDateTime };
