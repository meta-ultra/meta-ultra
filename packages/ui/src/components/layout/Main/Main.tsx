import { FC, PropsWithChildren, ReactNode } from "react";
import { Layout, Tabs } from "antd";
import "./Main.css";

interface Tab {
  key: string;
  label: ReactNode;
  closeIcon: ReactNode;
}
type MainProps = PropsWithChildren<{
  onRemove: (key: string) => void;
  onTabClick: (key: string) => void;
  items: Tab[];
  activeKey: string;
}>;

const Main: FC<MainProps> = ({
  children,
  items,
  activeKey,
  onRemove,
  onTabClick,
}) => {
  return (
    <Layout.Content className="mu-main">
      <Tabs
        type="editable-card"
        hideAdd
        activeKey={activeKey}
        items={items}
        onEdit={(e) => onRemove(e as string)}
        onTabClick={onTabClick}
      />
      <div className="mu-main__content">{children}</div>
    </Layout.Content>
  );
};

export type { MainProps, Tab };
export default Main;
