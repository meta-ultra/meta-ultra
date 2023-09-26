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
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  icon?: FunctionComponentElement<{ className: string }>;
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
      className={classNames("link-button", className)}
      style={style}
      title={typeof children == "string" ? children : ""}
    >
      {icon &&
        cloneElement(icon, {
          className: "link-button__icon",
        })}
      {hoverIcon &&
        cloneElement(hoverIcon, {
          className: "link-button__icon",
        })}
      {children}
    </a>
  );
};

export type { LinkButtonProps };
export default LinkButton;
