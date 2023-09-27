import { TableColumnType } from "antd";
import { isNil } from "lodash-es";
import { ColumnActions, ColumnActionsOption } from "../columns/ColumnActions/ColumnActions";

const actionsTableColumnModifier = <RecordType, ContextType>(
  column: TableColumnType<RecordType> & { type?: string },
  context?: ContextType
): TableColumnType<RecordType> | undefined => {
  if (column.type != "actions" || isNil(column.render)) return column;

  // TODO: Error-prone code starts
  if (context) {
    const concreteContext = (context as { [name: string]: unknown })[
      column.key as string
    ] as Record<string, unknown>;
    if (concreteContext != undefined) {
      if (typeof concreteContext == "object") {
        for (const name in concreteContext) {
          if (name === "render") continue;

          const key = name as keyof TableColumnType<RecordType>;
          const value = concreteContext[name];
          //@ts-expect-error: TODO
          column[key] = value;
        }
      }
    }
  }
  // Error-prone code ends

  return ColumnActions(column as ColumnActionsOption<RecordType>);
};

export { actionsTableColumnModifier };
