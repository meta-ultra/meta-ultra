import { TableColumnType } from "antd";

const visibleTableColumnModifier = <RecordType, ContextType>(
  column: TableColumnType<RecordType> | undefined,
  context?: ContextType
): TableColumnType<RecordType> | undefined => {
  if (column && column.key && context && typeof context === "object" && column.key in context) {
    const concreteContext = (context as { [name: string | number | symbol]: unknown })[column.key];
    if (concreteContext != undefined) {
      if (typeof concreteContext == "boolean") {
        if (concreteContext == false) {
          return undefined;
        }
      } else if ((concreteContext as { visible?: boolean }).visible == false) {
        return undefined;
      }
    }
  }

  return column;
};

export { visibleTableColumnModifier };
