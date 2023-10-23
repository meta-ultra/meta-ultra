import { FC, PropsWithChildren, useMemo } from "react";
import { Layout, Popover, Badge, Avatar } from "antd";
import { FaRegUser } from "react-icons/fa";
import { RxExit } from "react-icons/rx";
import "./Header.css";

interface HeaderProps {
  /**
   * Optional count of notification overlaying on the avatar
   */
  count?: number;
  /**
   * Optional click event for exiting system
   */
  onExit?: () => void;
}

const Header: FC<PropsWithChildren<HeaderProps>> = ({
  count = 0,
  onExit,
  children,
}) => {
  const content = useMemo(
    () => (
      <div>
        {children}
        <div className="mu-header__exit" onClick={onExit}>
          <RxExit className="mu-header__exit-icon" />
          退出系统
        </div>
      </div>
    ),
    [children, onExit]
  );

  return (
    <Layout.Header
      style={{
        paddingRight: 15 + (count > 0 ? 5 : 0),
        height: 36,
        background: "#fff",
      }}
    >
      <div className="mu-header__content">
        <Popover
          placement="bottomRight"
          content={content}
          trigger="hover"
          overlayInnerStyle={{ padding: 5 }}
        >
          <Badge count={count} size="small">
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              size="small"
              icon={<FaRegUser className="mu-header__avatar-icon" />}
            />
          </Badge>
        </Popover>
      </div>
    </Layout.Header>
  );
};

export type { HeaderProps };
export default Header;
