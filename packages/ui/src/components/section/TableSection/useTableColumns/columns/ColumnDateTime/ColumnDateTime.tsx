import { TableColumnType } from "antd";
import dayjs from "dayjs";

interface ColumnDateTimeOption<RecordType> extends TableColumnType<RecordType> {
  format: string;
}

const ColumnDateTime = <RecordType,>(
  option: ColumnDateTimeOption<RecordType>
) => ({
  ...option,
  render(dateTime: unknown) {
    return dayjs(dateTime as string | Date).format(option.format);
  },
});

export type { ColumnDateTimeOption };
export { ColumnDateTime };
