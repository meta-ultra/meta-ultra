import { useRef, useLayoutEffect, useState, Key, useMemo } from "react";
import { Table, TableProps, TableColumnsType } from "antd";
import { ContextualTableColumnsType } from "./useTableColumns/useTableColumns";
import { RecordTypeConstraint, ContextCheckboxType } from "./useTableColumns/types";
import useWindowResize from "../../../hooks/useWindowResize";
import withInitialProps from "../../../hocs/withInitialProps";
import "./TableSection.css";
import classNames from "classnames";

interface IPagination {
  defaultPageSize: number;
  showSizeChanger: boolean;
  total: number;
  page: number;
  pageSize: number;
  showTotal?: (total: number) => string;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

interface TableSectionProps<
  RecordType extends RecordTypeConstraint,
  ContextType extends ContextCheckboxType<RecordType>,
  ExtendedColumnType
> extends Partial<IPagination> {
  rowKey?: string | keyof RecordType;
  selectedRowKeys?: Key[];
  onSelectedRowKeysChange?: (ids: Key[]) => void;

  loading?: boolean;
  recalculateScroll?: unknown;
  columns: ContextualTableColumnsType<RecordType, ContextType, ExtendedColumnType>;
  readonly dataSource?: RecordType[];
  expandable?: TableProps<RecordType>["expandable"];
  minScrollX?: number;
  bordered?: boolean;
}

const TableSection = <
  RecordType extends RecordTypeConstraint,
  ContextType extends ContextCheckboxType<RecordType>,
  ExtendedColumnType
>({
  loading,
  recalculateScroll,
  columns,
  dataSource,
  rowKey,
  selectedRowKeys,
  onSelectedRowKeysChange,
  showTotal,
  defaultPageSize = 10,
  showSizeChanger = true,
  total,
  page,
  pageSize,
  onPaginationChange,
  expandable,
  minScrollX = 400,
  bordered,
}: TableSectionProps<RecordType, ContextType, ExtendedColumnType>) => {
  const { width: screenWidth, height: screenHeight } = useWindowResize();
  const [remainingDimensions, setRemainingDimensions] = useState({
    x: 0,
    y: 0,
  });

  // configuration for "pagination" property of Table component
  const pagination = useMemo(() => {
    if (onPaginationChange) {
      return {
        showTotal,
        defaultPageSize,
        showSizeChanger,
        onChange: onPaginationChange,
        current: page,
        total,
        pageSize,
        simple: remainingDimensions.x <= 640,
      };
    } else {
      return false;
    }
  }, [
    showTotal,
    defaultPageSize,
    showSizeChanger,
    page,
    total,
    pageSize,
    onPaginationChange,
    remainingDimensions.x,
  ]);

  // configuration for "scroll" property of Table component
  const sectionRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const handle = () => {
      if (sectionRef.current) {
        let invisibleHeight = 0;
        if (sectionRef.current.parentElement) {
          invisibleHeight =
            sectionRef.current.parentElement.scrollHeight -
            sectionRef.current.parentElement.offsetHeight;
        }
        const header = sectionRef.current.querySelector<HTMLDivElement>(".ant-table-header");
        const headerHeight = header ? header.offsetHeight : 0;

        setRemainingDimensions({
          x: sectionRef.current.offsetWidth,
          y: sectionRef.current.offsetHeight - headerHeight - invisibleHeight,
        });

        sectionRef.current.classList.remove("mu-table-section--invisible");
      }
    };

    // TODO: find a preciser solution
    setTimeout(handle, 500);
  }, [recalculateScroll, screenWidth, screenHeight, bordered]);

  const paginationVisible = !!pagination;
  const scroll = useMemo(() => {
    return {
      x: Math.max(remainingDimensions.x - 25, minScrollX),
      y: Math.max(remainingDimensions.y - (paginationVisible ? 70 : 0), 400),
    };
  }, [remainingDimensions, paginationVisible]);

  // configuration for "rowSelection" property of Table component
  type RowSelection = TableProps<RecordType>["rowSelection"];
  const rowSelection = useMemo<RowSelection>(() => {
    const rowSelection: RowSelection = {
      type: "checkbox",
      fixed: true,
      selectedRowKeys,
      onChange: onSelectedRowKeysChange,
    };

    if (columns.context) {
      if (columns.context.checkbox == false) {
        return undefined;
      } else if (columns.context.checkbox) {
        if ((columns.context.checkbox as { visible?: boolean }).visible == false) {
          return undefined;
        }

        Object.entries(columns.context.checkbox).forEach(([key, val]) => {
          rowSelection[key as keyof NonNullable<RowSelection>] = val;
        });
      }
    }

    return rowSelection;
  }, [columns.context, selectedRowKeys, onSelectedRowKeysChange]);

  return (
    <section
      ref={sectionRef}
      className={classNames("mu-table-section", "mu-table-section--invisible")}
    >
      <Table
        loading={loading || dataSource === undefined}
        rowKey={rowKey}
        rowSelection={rowSelection}
        columns={columns as TableColumnsType<RecordType>}
        dataSource={dataSource}
        scroll={scroll}
        pagination={pagination}
        expandable={expandable}
      />
    </section>
  );
};

const TableSectionWithInitialProps = withInitialProps(
  ["showTotal", "defaultPageSize"],
  TableSection
) as typeof TableSection & { displayName: string };
TableSectionWithInitialProps.displayName = "TableSectionWithInitialProps";

export type { TableSectionProps, IPagination };
export default TableSectionWithInitialProps;
