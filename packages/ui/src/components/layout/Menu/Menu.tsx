import { CSSProperties, FC, useState, createElement, useMemo } from "react";
import { Layout } from "antd";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import useEvent from "react-use-event-hook";
import { MenuItems, MenuItemsProps, MenuItem } from "./MenuItems";
import classNames from "classnames";
import "./Menu.css";

const Sider = Layout.Sider;

interface MenuProps extends MenuItemsProps {
  width?: number;
  collapsedWidth?: number;
  collapsed?: boolean;
  icon: React.FunctionComponent<{ className?: string; style?: CSSProperties }>;
  title: string;
}

const Menu: FC<MenuProps> = ({
  width = 280,
  collapsedWidth = 50,
  icon,
  title,
  onSelect,
  items,
  selectedKeys,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const header = useMemo(() => {
    if (collapsed) {
      return (
        <h1 className="mu-menu__header--collapsed">
          {createElement(icon, {
            className: "mu-menu__header--collapsed__icon",
          })}
        </h1>
      );
    } else {
      return (
        <h1
          className="mu-menu__header--expanded"
          style={{ lineHeight: "36px" }}
        >
          {createElement(icon, {
            className: "mu-menu__header--expanded__icon",
          })}
          {title}
        </h1>
      );
    }
  }, [collapsed, icon, title]);

  const trigger = useMemo(
    () => (collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />),
    [collapsed]
  );

  const handleToggle = useEvent(() => {
    setCollapsed((value) => !value);
  });

  return (
    <div className="mu-menu">
      <div
        className={classNames("mu-menu__content", {
          "mu-menu__content--collapsed": collapsed,
        })}
      >
        <Sider
          trigger={null}
          width={width}
          collapsedWidth={collapsedWidth}
          collapsible
          collapsed={collapsed}
          className="mu-menu__sider"
        >
          {header}
          <MenuItems
            onSelect={(key) => {
              setCollapsed(true);
              onSelect(key);
            }}
            items={items}
            selectedKeys={selectedKeys}
          />
        </Sider>
        <span className="mu-menu__trigger" onClick={handleToggle}>
          {trigger}
        </span>
      </div>
    </div>
  );
};

export type { MenuProps, MenuItem };
export default Menu;
