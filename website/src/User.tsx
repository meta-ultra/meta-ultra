import React from "react";
import { Form, Input } from "antd";
import { CURD } from "@meta-ultra/ui";

const queryFormItems = (
  <Form.Item label="用户名称/账号" name="name">
    <Input placeholder="请输入用户名称或账号关键字" />
  </Form.Item>
);

const ID = "users";

const User = () => {
  const [dataSource, onQuery, refresh] = CURD.useCURDQuery<{ name: string }>(
    ID,
    async (query, pagination) => {
      return { data: [{ name: "hi2" }, { name: "nnn" }], total: 2 };
    }
  );

  const queryButtons = CURD.useCURDQueryButtons(
    () => ({
      context: {
        search: {
          searchText: "查 询",
          refreshText: "刷 新",
        },
        create: { text: "新 增" },
        update: { text: "修 改" },
        delete: { text: "删 除" },
      },
    }),
    []
  );

  const tableColumns = CURD.useCURDTableColumns(
    () => ({
      columns: [
        { title: "用户名称", dataIndex: "name", key: "name", sortable: true },
      ],
    }),
    []
  );

  return (
    <CURD
      onQuery={onQuery}
      queryFormItems={queryFormItems}
      queryButtons={queryButtons}
      tableRowKey="name"
      tableColumns={tableColumns}
      tableDataSource={dataSource.data}
      tableTotal={dataSource.total}
      tableActionsUpdateText="修改"
      tableActionsDeleteText="删除"
    />
  );
};

export default User;
