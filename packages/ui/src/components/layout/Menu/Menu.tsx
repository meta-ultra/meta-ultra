import {
  CSSProperties,
  FC,
  useState,
  createElement,
  useMemo,
  isValidElement,
  cloneElement,
} from "react";
import { Layout } from "antd";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import useEvent from "react-use-event-hook";
import { MenuItems, MenuItemsProps, MenuItem } from "./MenuItems";
import classNames from "classnames";
import "./Menu.css";
import { isValidElementType } from "react-is";

const Sider = Layout.Sider;

interface MenuProps extends MenuItemsProps {
  /**
   * Optional width of expanded menu
   */
  width?: number;
  /**
   * Optional width of collapsed menu
   */
  collapsedWidth?: number;
  /**
   * Optional if collapsed
   */
  collapsed?: boolean;
  /**
   * Optional logo
   */
  icon?:
    | React.FunctionComponent<{ className?: string; style?: CSSProperties }>
    | React.ReactElement<{ className?: string }>;
  /**
   * Required title
   */
  title: string;
  theme?: MenuItemsProps["theme"];
}

const Menu: FC<MenuProps> = ({
  theme,
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
          {isValidElementType(icon)
            ? createElement(icon, {
                className: "mu-menu__header--collapsed__icon",
              })
            : isValidElement(icon)
            ? cloneElement(icon, {
                className: classNames(icon.props.className, "mu-menu__header--collapsed__icon"),
              })
            : null}
        </h1>
      );
    } else {
      return (
        <h1
          className="mu-menu__header--expanded"
          style={
            {
              lineHeight: "36px",
              "--header-color": theme === "dark" ? "#fff" : "#000",
            } as CSSProperties
          }
        >
          {isValidElementType(icon)
            ? createElement(icon, {
                className: "mu-menu__header--expanded__icon",
              })
            : isValidElement(icon)
            ? cloneElement(icon, {
                className: classNames(icon.props.className, "mu-menu__header--expanded__icon"),
              })
            : null}
          {title.length > 10 ? title.slice(0, 10) + "..." : title}
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
          theme={theme}
          trigger={null}
          width={width}
          collapsedWidth={collapsedWidth}
          collapsible
          collapsed={collapsed}
          className="mu-menu__sider"
        >
          {header}
          <MenuItems
            theme={theme}
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
