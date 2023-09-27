import { TableColumnType } from "antd";
import { merge } from "lodash-es";

type ModifierType<RecordType, ContextType> = (
  column: TableColumnType<RecordType>,
  context?: ContextType
) => TableColumnType<RecordType> | undefined;

/**
 * Caveat: the order of processing is from right to left.
 * @param modifiers
 * @param column
 * @param context
 * @returns
 */
const applyModifiers = <RecordType, ContextType>(
  modifiers: ModifierType<RecordType, ContextType>[],
  column: TableColumnType<RecordType> | undefined,
  context: ContextType | undefined
): TableColumnType<RecordType> | undefined => {
  let modifiedColumn: TableColumnType<RecordType> | undefined;

  if (column) {
    modifiedColumn = merge({}, column);
    for (let i = modifiers.length - 1; modifiedColumn && i >= 0; i--) {
      const modifier = modifiers[i];
      if (modifier) {
        modifiedColumn = modifier(modifiedColumn, context);
      }
    }
  }

  return modifiedColumn;
};

export type { ModifierType };
export { applyModifiers };
