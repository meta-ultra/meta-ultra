import {
  useTableColumns,
  ColumnActions,
  ColumnStatus,
  ColumnDateTime,
  sortableTableColumnModifier,
  actionsTableColumnModifier,
  visibleTableColumnModifier,
  renderTableColumnModifier,
  createContextActions,
} from "./useTableColumns";
import TableSection from "./TableSection";

type TableSectionNamespace = {
  useTableColumns: typeof useTableColumns;
  ColumnActions: typeof ColumnActions;
  ColumnStatus: typeof ColumnStatus;
  ColumnDateTime: typeof ColumnDateTime;
  sortableTableColumnModifier: typeof sortableTableColumnModifier;
  actionsTableColumnModifier: typeof actionsTableColumnModifier;
  visibleTableColumnModifier: typeof visibleTableColumnModifier;
  renderTableColumnModifier: typeof renderTableColumnModifier;
  createContextActions: typeof createContextActions;
};

const TableSectionNamespace: typeof TableSection &
  Partial<TableSectionNamespace> = TableSection;
TableSectionNamespace.useTableColumns = useTableColumns;
TableSectionNamespace.ColumnActions = ColumnActions;
TableSectionNamespace.ColumnStatus = ColumnStatus;
TableSectionNamespace.ColumnDateTime = ColumnDateTime;
TableSectionNamespace.sortableTableColumnModifier = sortableTableColumnModifier;
TableSectionNamespace.actionsTableColumnModifier = actionsTableColumnModifier;
TableSectionNamespace.visibleTableColumnModifier = visibleTableColumnModifier;
TableSectionNamespace.renderTableColumnModifier = renderTableColumnModifier;
TableSectionNamespace.createContextActions = createContextActions;

export type {
  ContextualTableColumnsType,
  ContextRenderType,
  ContextNextRenderType,
  RenderReturnType,
  ContextCheckboxType,
  RecordTypeConstraint,
} from "./useTableColumns";
export type { TableSectionProps, IPagination } from "./TableSection";
export default TableSectionNamespace as typeof TableSection &
  TableSectionNamespace;
