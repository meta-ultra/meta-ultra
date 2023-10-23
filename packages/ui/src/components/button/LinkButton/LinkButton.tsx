import {
  FC,
  CSSProperties,
  cloneElement,
  PropsWithChildren,
  FunctionComponentElement,
} from "react";
import classNames from "classnames";
import "./LinkButton.css";

type LinkButtonProps = PropsWithChildren<{
  /**
   * Optional class name
   */
  className?: string;
  /**
   * Optional style object
   */
  style?: CSSProperties;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Optional icon prefixing the children
   */
  icon?: FunctionComponentElement<{ className: string }>;
  /**
   * Optional icon prefixing the children in hover state
   */
  hoverIcon?: FunctionComponentElement<{ className: string }>;
}>;

const LinkButton: FC<LinkButtonProps> = ({
  children,
  className,
  style,
  onClick,
  icon,
  hoverIcon,
}) => {
  return (
    <a
      onClick={onClick}
      className={classNames(
        "mu-link-button",
        onClick ? "mu-link--clickable" : undefined,
        className
      )}
      style={style}
      title={typeof children == "string" ? children : ""}
    >
      {icon &&
        cloneElement(icon, {
          className: "mu-link-button__icon",
        })}
      {hoverIcon &&
        cloneElement(hoverIcon, {
          className: "mu-link-button__icon",
        })}
      {children}
    </a>
  );
};

export type { LinkButtonProps };
export default LinkButton;
