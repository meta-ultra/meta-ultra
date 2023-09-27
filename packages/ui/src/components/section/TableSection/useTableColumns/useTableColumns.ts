import { DependencyList, useMemo } from "react";
import { TableColumnType } from "antd";
import { isArray } from "lodash-es";
import { ContextCheckboxType, ContextualType, RecordTypeConstraint } from "./types";
import {
  ModifierType,
  applyModifiers,
  visibleTableColumnModifier,
  renderTableColumnModifier,
} from "./modifiers";

interface TableColumnsType<RecordType> extends TableColumnType<RecordType> {
  children?: TableColumnsType<RecordType>[];
}

type ColumnType<RecordType, ExtendedColumnType = unknown> = TableColumnsType<RecordType> &
  ExtendedColumnType;

// enhancement version of "TableColumnsType" with "context" and "modifiers" properties
type ContextualTableColumnsType<RecordType, ContextType, ExtendedColumnType> = ContextualType<
  ContextType,
  ColumnType<RecordType, ExtendedColumnType>[]
> & {
  modifiers?: ModifierType<RecordType, ContextType>[];
};

type ContextualColumnsType<RecordType, ContextType, ExtendedColumnType> = ContextualType<
  ContextType,
  {
    columns: ColumnType<RecordType, ExtendedColumnType>[];
    modifiers?: ModifierType<RecordType, ContextType>[];
  }
>;

type FactoryReturnType<RecordType, ContextType, ExtendedColumnType> =
  | ColumnType<RecordType, ExtendedColumnType>[]
  | ContextualColumnsType<RecordType, ContextType, ExtendedColumnType>;

interface UseTableColumns<BaseExtendedColumnType = unknown, BaseContexType = unknown> {
  <
    RecordType extends RecordTypeConstraint,
    ContexType extends BaseContexType & ContextCheckboxType<RecordType> = BaseContexType &
    ContextCheckboxType<RecordType>,
    ExtendedColumnType extends BaseExtendedColumnType = BaseExtendedColumnType
  >(
    factory: () => FactoryReturnType<RecordType, ContexType, ExtendedColumnType>,
    deps: DependencyList
  ): ContextualTableColumnsType<RecordType, ContexType, ExtendedColumnType>;
}

const useTableColumns: UseTableColumns = <RecordType, ContexType, ExtendedColumnType>(
  factory: () => FactoryReturnType<RecordType, ContexType, ExtendedColumnType>,
  deps: DependencyList
): ContextualTableColumnsType<RecordType, ContexType, ExtendedColumnType> => {
  return useMemo<ContextualTableColumnsType<RecordType, ContexType, ExtendedColumnType>>(
    () => {
      const columns = factory();
      const contextualColumns = isArray(columns)
        ? {
          columns,
          context: undefined,
          modifiers: [],
        }
        : columns;

      // Caveat: the order of processing is from right to left.
      const modifiers = [
        ...(contextualColumns.modifiers ?? []),
        renderTableColumnModifier,
        visibleTableColumnModifier,
      ];

      const contextualTableColumns: ContextualTableColumnsType<
        RecordType,
        ContexType,
        ExtendedColumnType
      > = [];
      for (const column of contextualColumns.columns) {
        const contextualTableColumn = applyModifiers(
          modifiers,
          column,
          contextualColumns.context
        ) as ColumnType<RecordType, ExtendedColumnType>;
        if (contextualTableColumn) {
          contextualTableColumns.push(contextualTableColumn);
        }
      }

      contextualTableColumns.context = contextualColumns.context;
      contextualTableColumns.modifiers = contextualColumns.modifiers;

      return contextualTableColumns;
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
};

export type { ContextualTableColumnsType, FactoryReturnType, UseTableColumns };
export { useTableColumns };
