import { FC, createElement, ReactNode } from "react";
import { Menu, type MenuProps } from "antd";

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
  theme?: MenuProps["theme"];
  /**
   * Required click event on menu item
   */
  onSelect: (key: string) => void;
  /**
   * Requried menu items
   */
  items: MenuItem[];
  /**
   * Require selected keys of menu item
   */
  selectedKeys: string[];
}

const MenuItems: FC<MenuItemsProps> = ({ theme = "dark", onSelect, items, selectedKeys }) => {
  return (
    <Menu
      theme={theme}
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
      onSelect={({ key }) => onSelect(key)}
    />
  );
};

export type { MenuItem, MenuItemsProps };
export { MenuItems };
