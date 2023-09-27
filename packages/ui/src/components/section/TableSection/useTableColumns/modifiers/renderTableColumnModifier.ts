import { TableColumnType } from "antd";

type RenderReturnType<RecordType> = ReturnType<NonNullable<TableColumnType<RecordType>["render"]>>;

interface ContextNextRenderType<RecordType> {
  (value?: unknown, record?: RecordType, index?: number): RenderReturnType<RecordType>;
}

interface ContextRenderType<RecordType> {
  (
    value: unknown,
    record: RecordType,
    index: number,
    next: ContextNextRenderType<RecordType>
  ): RenderReturnType<RecordType>;
}

const renderTableColumnModifier = <RecordType, ContextType>(
  column: TableColumnType<RecordType>,
  context?: ContextType
): TableColumnType<RecordType> | undefined => {
  if (column && column.key && context && typeof context === "object" && column.key in context) {
    const concreteContext = (context as { [name: string | number | symbol]: unknown })[column.key];
    if (
      typeof concreteContext == "object" &&
      typeof (concreteContext as unknown as { render: ContextRenderType<RecordType> }).render ==
      "function"
    ) {
      const render = (
        concreteContext as unknown as {
          render: ContextRenderType<RecordType>;
        }
      ).render;
      const nextRender = column.render;
      column.render = (value: unknown, record: RecordType, index: number) => {
        const next: ContextNextRenderType<RecordType> = (v?: unknown, r?: RecordType, i?: number) =>
          nextRender && nextRender(v ?? value, r ?? record, i ?? index);

        return render(value, record, index, next);
      };
    }
  }

  return column;
};

export type { ContextRenderType, ContextNextRenderType, RenderReturnType };
export { renderTableColumnModifier };
