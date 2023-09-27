import { TableColumnType, Tag } from "antd";

interface ColumnStatusOption<RecordType> extends TableColumnType<RecordType> {
  trueText: string;
  falseText: string;
  trueValue: unknown;
}

const ColumnStatus = <RecordType,>(option: ColumnStatusOption<RecordType>) => ({
  ...option,
  render(status: unknown) {
    return (
      <Tag color={status == option.trueValue ? "green" : "volcano"}>
        {status == option.trueValue ? option.trueText : option.falseText}
      </Tag>
    );
  },
});

export type { ColumnStatusOption };
export { ColumnStatus };
