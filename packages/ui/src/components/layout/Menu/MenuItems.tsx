import { FC, createElement, ReactNode } from "react";
import { Menu } from "antd";

/**
 * @see https://ant.design/components/menu-cn#itemtype
 */
interface MenuItem {
  key: string;
  label: ReactNode;
  title?: string;
  icon?: ReturnType<typeof createElement>;
  disabled?: boolean;
  children?: MenuItem[];
}

interface MenuItemsProps {
  onSelect: (key: string) => void;
  items: MenuItem[];
  selectedKeys: string[];
}

const MenuItems: FC<MenuItemsProps> = ({ onSelect, items, selectedKeys }) => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
      onSelect={({ key }) => onSelect(key)}
    />
  );
};

export type { MenuItem, MenuItemsProps };
export { MenuItems };
