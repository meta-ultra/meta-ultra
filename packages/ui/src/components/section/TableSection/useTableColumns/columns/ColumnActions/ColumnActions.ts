import { Key } from "react";
import { TableColumnType } from "antd";
import { ContextNextRenderType } from "../../modifiers";

interface ColumnActionsOption<RecordType> {
  key: Key;
  title?: string;
  width?: number;
  render: ContextNextRenderType<RecordType>;
}

const ColumnActions = <RecordType>(
  option: ColumnActionsOption<RecordType>
): TableColumnType<RecordType> => {
  return {
    key: option.key,
    title: option.title,
    align: "center",
    fixed: "right",
    width: option.width || 120,
    render: option.render,
  };
};

export type { ColumnActionsOption };
export { ColumnActions };
