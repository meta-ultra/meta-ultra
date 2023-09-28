import { Key, useState, useRef, useReducer, ReactNode, useEffect } from "react";
import {
  FormInstance,
  Modal,
  message,
  Alert,
  Breadcrumb,
  BreadcrumbProps,
} from "antd";
import useEvent from "react-use-event-hook";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { isNil, merge } from "lodash-es";
import TableSection, {
  TableSectionProps,
  ContextCheckboxType,
  RecordTypeConstraint,
} from "../../components/section/TableSection";
import LinkUpdateButton from "../../components/button/LinkUpdateButton/LinkUpdateButton";
import LinkDeleteButton from "../../components/button/LinkDeleteButton/LinkDeleteButton";
import {
  ContextRenderType,
  dateTimeTableColumnModifier,
  statusTableColumnModifier,
} from "../../components/section/TableSection/useTableColumns/modifiers";
import { UseTableColumns } from "../../components/section/TableSection/useTableColumns";
import QuerySection, {
  QuerySectionProps,
} from "../../components/section/QuerySection";
import useElements, {
  UseElements,
  ContextualReactNodesType,
} from "../../hooks/useElements/useElements";
import { QueryButtonStatus } from "../../components/section/QuerySection/buttons/types";
import { ButtonSearch } from "../../components/section/QuerySection/buttons/ButtonSearch/ButtonSearch";
import { ButtonCreate } from "../../components/section/QuerySection/buttons/ButtonCreate/ButtonCreate";
import { ButtonDelete } from "../../components/section/QuerySection/buttons/ButtonDelete/ButtonDelete";
import { ButtonUpdate } from "../../components/section/QuerySection/buttons/ButtonUpdate/ButtonUpdate";
import {
  buttonSearchModifier,
  buttonTextModifier,
} from "../../hooks/useElements/modifiers";
import FormDialog from "../../components/dialog/FormDialog/FormDialog";
import "./CURD.css";

const {
  useTableColumns,
  actionsTableColumnModifier,
  sortableTableColumnModifier,
} = TableSection;

type CURDQuerySectionProps<FormItemsType extends object, ContextType> = {
  [P in keyof QuerySectionProps<
    FormItemsType,
    ContextType
  > as P extends "children"
    ? never
    : `query${Capitalize<P>}`]: QuerySectionProps<
    FormItemsType,
    ContextType
  >[P];
} & {
  queryFormItems?: ReactNode;
  initialQuery?: Record<string, unknown>;
};

type CURDTableSectionProps<
  RecordType extends RecordTypeConstraint,
  ContextType extends ContextCheckboxType<RecordType> &
    CURDContextType<RecordType>,
  ExtendedColumnType
> = {
  [P in keyof TableSectionProps<
    RecordType,
    ContextType,
    ExtendedColumnType
  > as P extends
    | "loading"
    | "recalculateScroll"
    | "onPaginationChange"
    | "page"
    | "pageSize"
    ? never
    : `table${Capitalize<P>}`]: TableSectionProps<
    RecordType,
    ContextType,
    ExtendedColumnType
  >[P];
} & {
  tableActionsUpdateText?: string;
  tableActionsDeleteText?: string;
  initialTablePage?: number;
  initialTablePageSize?: number;
};

type CURDProps<
  QueryFormItemsType extends object,
  QueryContextType,
  TableRecordType extends RecordTypeConstraint,
  TableContextType extends ContextCheckboxType<TableRecordType> &
    CURDContextType<TableRecordType>,
  TableExtendedColumnType
> = CURDQuerySectionProps<QueryFormItemsType, QueryContextType> &
  CURDTableSectionProps<
    TableRecordType,
    TableContextType,
    TableExtendedColumnType
  > & {
    onQuery?: (
      query: Record<string, unknown>,
      pagination: { page: number; pageSize: number }
    ) => Promise<unknown>;
    onDeleteRecords?: (keys: Key[]) => Promise<{ error: Error } | void>;
    deleteConfirmText?:
      | string
      | ((record: TableRecordType, selectedRowKeysCount: number) => string);
    deleteCancelText?: string;
    deleteOkText?: string;
    deleteSuccessText?: string;
    selectedRowKeysText?: (selectedRowKeysCount: number) => string;
    breadcrumb?: BreadcrumbProps["items"];
    createDialogSuccessText?: string;
    createDialogTitleText?: string;
    createDialogTipText?: string;
    createDialogContent?: ReactNode;
    createDialogCancelText?: string;
    createDialogConfirmText?: string;
    createDialogFooter?: ContextualReactNodesType<{
      confirm: { onClick: (values: Record<string, unknown>) => void };
    }>;
    updateDialogSuccessText?: string;
    updateDialogTitleText?: string;
    updateDialogTipText?: string;
    updateDialogContent?: ReactNode;
    updateDialogCancelText?: string;
    updateDialogConfirmText?: string;
    updateDialogFooter?: ContextualReactNodesType<{
      confirm: { onClick: (values: Record<string, unknown>) => void };
    }>;
  };

const useCURDQueryButtons: UseElements<{
  search?:
    | boolean
    | { visible?: boolean; refreshText?: string; searchText?: string };
  create?: boolean | { visible?: boolean; text?: string };
  update?: boolean | { visible?: boolean; text?: string };
  delete?: boolean | { visible?: boolean; text?: string };
}> = useElements;

type CURDContextType<BaseRecordType> = {
  actions?:
    | boolean
    | {
        visible?: boolean;
        render: ContextRenderType<BaseRecordType>;
      };
};

// TODO: wait for improving
type UseCURDTableColumns<RecordType> = UseTableColumns<
  {
    sortable?: boolean;
  } & (
    | {
        type?: "actions";
        format?: never;
        trueText?: never;
        falseText?: never;
        trueValue?: never;
      }
    | {
        type?: "datetime";
        format: string;
        trueText?: never;
        falseText?: never;
        trueValue?: never;
      }
    | {
        type?: "sortable";
        format?: never;
        trueText?: never;
        falseText?: never;
        trueValue?: never;
      }
    | {
        type?: "status";
        format?: never;
        trueText?: string;
        falseText?: string;
        trueValue?: unknown;
      }
  ),
  CURDContextType<RecordType>
>;
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const useCURDTableColumns: UseCURDTableColumns<any> = useTableColumns;

// TODO: move to a isolated file
interface PipeFnType {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any;
}
const pipe = (...fns: PipeFnType[]): PipeFnType | void => {
  if (fns.length == 0) return;
  if (fns.length == 1) return fns[0];

  const [prev, next] = fns.slice(-2);
  return pipe(
    ...fns.slice(0, -2),
    (...args: unknown[]): unknown => prev && prev(next, ...args)
  );
};

const CURD = <
  QueryFormItemsType extends object,
  QueryContextType,
  TableRecordType extends RecordTypeConstraint,
  TableContextType extends ContextCheckboxType<TableRecordType> &
    CURDContextType<TableRecordType>,
  TableExtendedColumnType
>(
  props: CURDProps<
    QueryFormItemsType,
    QueryContextType,
    TableRecordType,
    TableContextType,
    TableExtendedColumnType
  >
) => {
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [internalState, dispatch] = useReducer(
    (
      state: {
        query: Record<string, unknown>;
        pagination: { page: number; pageSize: number };
      },
      action:
        | {
            type: "PAGINATION/SET";
            payload: { page: number; pageSize: number };
          }
        | { type: "QUERY/SET"; payload: Record<string, unknown> }
    ) => {
      switch (action.type) {
        case "QUERY/SET":
          return { ...state, query: action.payload };
        case "PAGINATION/SET":
          return { ...state, pagination: action.payload };
        default:
          return state;
      }
    },
    {
      query: props.initialQuery ?? {},
      pagination: {
        page: props.initialTablePage ?? 1,
        pageSize: props.initialTablePageSize ?? 10,
      },
    }
  );

  useEffect(() => {
    const onQuery = props.onQuery;
    if (onQuery) {
      (async () => {
        if (onQuery) {
          setLoading(true);

          try {
            await onQuery(internalState.query, internalState.pagination);
          } catch (e) {
            messageApi.error((e as Error).message);
          } finally {
            setLoading(false);
          }
        }
      })();
    }
  }, [
    props.onQuery,
    internalState.query,
    internalState.pagination,
    messageApi,
  ]);

  const [loading, setLoading] = useState(false);
  const handleSearch = useEvent(async ({ form }) => {
    try {
      const values = form.getFieldsValue();
      dispatch({ type: "QUERY/SET", payload: values });
    } catch (e) {
      messageApi.error((e as Error).message);
    }
  });
  const handleCreateClick = useEvent(() => {
    if (props.createDialogContent) {
      setCreateDialogVisible(true);
    }
  });

  const editingRecordRef = useRef<TableRecordType>();
  const [editingRecord, setEditingRecord] = useState<TableRecordType>();
  const handleUpdateClick = useEvent(({ state }) => {
    const values = state ?? editingRecordRef.current;
    setEditingRecord(values);
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const handleSelectedRowKeysChange = useEvent((keys: Key[]) => {
    setSelectedRowKeys(keys);

    // cache the single one selected record for modification in the future, which might be not found when go to the next page.
    if (
      keys.length == 1 &&
      props.tableRowKey !== undefined &&
      props.tableDataSource
    ) {
      const rowKey = props.tableRowKey;
      editingRecordRef.current = props.tableDataSource.find(
        (record) => record[rowKey] == keys[0]
      );
    } else {
      editingRecordRef.current = undefined;
    }
  });

  const handleDeleteRecords = useEvent(({ state }) => {
    if (!props.onDeleteRecords) {
      // debug(`Property 'onDeleteRecords' of 'CURD' is undefined.`);

      return;
    }

    if (props.deleteConfirmText === undefined) {
      // error(`Property 'deleteConfirmText' of 'CURD' is undefined.`);

      return;
    }

    modal.confirm({
      content: (
        <span className="mu-curd__delete-confirm__content">
          {typeof props.deleteConfirmText == "string"
            ? props.deleteConfirmText
            : props.deleteConfirmText(state, selectedRowKeys.length)}
        </span>
      ),
      icon: (
        <AiOutlineExclamationCircle
          size={24}
          className="mu-curd__delete-confirm__icon"
        />
      ),
      okText: props.deleteOkText,
      cancelText: props.deleteCancelText,
      async onOk() {
        if (props.onDeleteRecords) {
          const keys = isNil(state)
            ? selectedRowKeys || []
            : [state[props.tableRowKey]];
          try {
            const result = await props.onDeleteRecords(keys);
            dispatch({
              type: "PAGINATION/SET",
              payload: { ...internalState.pagination },
            }); // refresh the table
            if (result) {
              messageApi.open({ type: "error", content: result.error.message });
            } else {
              messageApi.open({
                type: "success",
                content: props.deleteSuccessText,
              });
            }
          } catch (error) {
            messageApi.open({
              type: "error",
              content: (error as Error).message,
            });
          }
        }
      },
    });
  });

  const queryButtons = useElements(
    () => ({
      elements: (
        <>
          <ButtonSearch key="search" onClick={handleSearch} />
          <ButtonCreate key="create" onClick={handleCreateClick} />
          <ButtonUpdate key="update" onClick={handleUpdateClick} />
          <ButtonDelete key="delete" onClick={handleDeleteRecords} />
        </>
      ),
      context: merge(
        {},
        {
          update: {
            status:
              selectedRowKeys.length == 1
                ? QueryButtonStatus.ENABLE
                : QueryButtonStatus.DISABLE,
          },
          delete: {
            status:
              selectedRowKeys.length >= 1
                ? QueryButtonStatus.ENABLE
                : QueryButtonStatus.DISABLE,
          },
        },
        props.queryButtons ? props.queryButtons.context : {}
      ),

      modifiers: [buttonSearchModifier, buttonTextModifier],
    }),
    [selectedRowKeys, props.queryButtons]
  );

  const columns = useCURDTableColumns<TableRecordType, TableContextType>(
    () => ({
      columns: [
        ...props.tableColumns,
        {
          key: "actions",
          type: "actions",
          render(value: unknown, record: TableRecordType) {
            return (
              <>
                <LinkUpdateButton
                  key="update"
                  state={record}
                  text={props.tableActionsUpdateText ?? ""}
                  onClick={handleUpdateClick}
                />
                <LinkDeleteButton
                  key="delete"
                  state={record}
                  text={props.tableActionsDeleteText ?? ""}
                  onClick={handleDeleteRecords}
                />
              </>
            );
          },
        },
      ],
      modifiers: [
        ...(props.tableColumns.modifiers ?? []),
        statusTableColumnModifier,
        actionsTableColumnModifier,
        dateTimeTableColumnModifier,
        sortableTableColumnModifier,
      ],
      context: props.tableColumns.context,
    }),
    []
  );

  const handlePaginationChange = useEvent((page, pageSize) => {
    dispatch({ type: "PAGINATION/SET", payload: { page, pageSize } });
  });

  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const createDialogFormRef = useRef<FormInstance | null>(null);
  const createDialogFooter = useElements(() => {
    if (
      props.createDialogFooter &&
      props.createDialogFooter.context &&
      typeof props.createDialogFooter.context.confirm == "object" &&
      typeof (
        props.createDialogFooter.context.confirm as unknown as {
          onClick: unknown;
        }
      ).onClick == "function"
    ) {
      const onClick = (
        props.createDialogFooter.context.confirm as unknown as {
          onClick: (values: unknown) => unknown;
        }
      ).onClick;

      return {
        context: {
          confirm: {
            onClick: pipe(
              async (
                next: (...values: unknown[]) => unknown,
                ...values: unknown[]
              ) => {
                try {
                  next && (await next(...values));
                  createDialogFormRef.current &&
                    createDialogFormRef.current.resetFields();
                  dispatch({
                    type: "PAGINATION/SET",
                    payload: { ...internalState.pagination },
                  }); // refresh the table
                  setCreateDialogVisible(false);
                  messageApi.open({
                    type: "success",
                    content: props.createDialogSuccessText,
                  });
                } catch (e) {
                  messageApi.open({
                    type: "error",
                    content: (e as Error).message,
                  });
                }
              },
              onClick
            ),
          },
        },
      };
    } else {
      return [];
    }
  }, [props.createDialogFooter]);

  const updateDialogFormRef = useRef<FormInstance | null>(null);
  const updateDialogFooter = useElements(() => {
    if (
      props.updateDialogFooter &&
      props.updateDialogFooter.context &&
      typeof props.updateDialogFooter.context.confirm == "object" &&
      typeof (
        props.updateDialogFooter.context.confirm as unknown as {
          onClick: unknown;
        }
      ).onClick == "function"
    ) {
      const onClick = (
        props.updateDialogFooter.context.confirm as unknown as {
          onClick: (values: unknown) => unknown;
        }
      ).onClick;
      return {
        context: {
          confirm: {
            onClick: pipe(
              async (
                next: (...values: unknown[]) => unknown,
                ...values: unknown[]
              ) => {
                try {
                  next && (await next(...values));
                  updateDialogFormRef.current &&
                    updateDialogFormRef.current.resetFields();
                  setEditingRecord(undefined);
                  dispatch({
                    type: "PAGINATION/SET",
                    payload: { ...internalState.pagination },
                  }); // refresh the table
                  messageApi.open({
                    type: "success",
                    content: props.updateDialogSuccessText,
                  });
                } catch (e) {
                  messageApi.open({
                    type: "error",
                    content: (e as Error).message,
                  });
                }
              },
              onClick
            ),
          },
        },
      };
    } else {
      return [];
    }
  }, [props.updateDialogFooter]);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <div className="mu-curd">
        {props.breadcrumb && <Breadcrumb items={props.breadcrumb} />}
        <QuerySection
          initialValues={internalState.query}
          buttonMoreText={props.queryButtonMoreText}
          buttons={queryButtons}
        >
          {props.queryFormItems}
        </QuerySection>
        {props.selectedRowKeysText ? (
          <Alert
            message={props.selectedRowKeysText(selectedRowKeys.length)}
            type="info"
            showIcon
            banner
          />
        ) : null}
        <TableSection
          rowKey={props.tableRowKey}
          columns={columns}
          dataSource={props.tableDataSource}
          selectedRowKeys={selectedRowKeys}
          loading={loading}
          total={props.tableTotal}
          defaultPageSize={props.tableDefaultPageSize}
          showSizeChanger={props.tableShowSizeChanger}
          onSelectedRowKeysChange={handleSelectedRowKeysChange}
          page={internalState.pagination.page}
          pageSize={internalState.pagination.pageSize}
          onPaginationChange={
            props.tableTotal === undefined ? undefined : handlePaginationChange
          }
          expandable={props.tableExpandable}
        />
      </div>
      {/* Dialog for creation */}
      <FormDialog
        ref={createDialogFormRef}
        title={props.createDialogTitleText || ""}
        tip={props.createDialogTipText}
        visible={createDialogVisible}
        textCancel={props.createDialogCancelText}
        textConfirm={props.createDialogConfirmText}
        footer={createDialogFooter}
        onClose={() => setCreateDialogVisible(false)}
      >
        {props.createDialogContent}
      </FormDialog>
      {/* Dialog for update */}
      <FormDialog
        ref={updateDialogFormRef}
        title={props.updateDialogTitleText || ""}
        tip={props.updateDialogTipText}
        visible={!!editingRecord}
        footer={updateDialogFooter}
        textCancel={props.updateDialogCancelText}
        textConfirm={props.updateDialogConfirmText}
        onClose={() => setEditingRecord(undefined)}
        record={editingRecord}
      >
        {editingRecord && props.updateDialogContent
          ? props.updateDialogContent
          : null}
      </FormDialog>
    </>
  );
};

export type { UseCURDTableColumns };
export { CURD, useCURDTableColumns, useCURDQueryButtons };
