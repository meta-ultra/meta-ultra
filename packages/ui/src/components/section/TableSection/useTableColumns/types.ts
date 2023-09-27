import type { TableColumnType } from "antd";

// context related types' declaration
interface RecordTypeConstraint {
  [name: string | number]: unknown;
}

interface ContextCheckboxType<RecordType> {
  checkbox?:
    | boolean
    | {
        visible?: boolean;
        renderCell?: (
          value: boolean,
          record: RecordType,
          index: number,
          originNode: React.ReactNode
        ) => ReturnType<NonNullable<TableColumnType<RecordType>["render"]>>;
        hideSelectAll?: boolean;
      };
}

type ContextualType<ContextType, T extends object> = Omit<T, "context"> & {
  context?: ContextType;
};

export type { RecordTypeConstraint, ContextCheckboxType, ContextualType };
