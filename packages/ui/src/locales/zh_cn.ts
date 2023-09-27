const crud = {
  textButtonRefresh: "刷 新",
  textButtonSearch: "查 询",
  textButtonCreate: "新 增",
  textButtonModify: "修 改",
  textButtonDelete: "删 除",
  textTableOperationDelete: "删 除",
  textTableOperationModify: "修 改",
  textCancel: "取 消",
  textOk: "确 定",
  textDeleteSuccess: "删除记录成功",
  textModifySuccess: "修改记录成功",
  textCreateSuccess: "新增记录成功",
  textDeletingConfirm: (record: unknown, selectedRowKeysCount: number) =>
    record ? `确定删除记录吗？` : `确定删除${selectedRowKeysCount}条记录？`,
  textSelectedRowKeys: (selectedRowKeysCount: number) => `已选择${selectedRowKeysCount}条记录`,
  textCreateDialogTitle: "新增",
  textModifyDialogTitle: "修改",
  textDialogCancel: "取 消",
  textDialogConfirm: "保 存",
};

export { crud };
