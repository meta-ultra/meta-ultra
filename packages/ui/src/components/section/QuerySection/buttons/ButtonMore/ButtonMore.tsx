import type { FC } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import classNames from "classnames";
import useEvent from "react-use-event-hook";
import { QueryButtonProps } from "../types";
import { useQuerySectionContext } from "../../useQuerySectionContext";
import "./ButtonMore.css";

interface ButtonMoreProps extends QueryButtonProps {
  text?: string;
  expand?: boolean;
}

const ButtonMore: FC<ButtonMoreProps> = (props) => {
  const { form } = useQuerySectionContext();

  const handleClick = useEvent(() => {
    props.onClick({ form });
  });

  return (
    <a
      className={classNames("mu-button-more", props.className)}
      style={props.style}
      onClick={handleClick}
    >
      <IoChevronDownOutline
        className={classNames("mu-button-more__icon", {
          "mu-button-more__icon--expanded": props.expand,
        })}
      />
      {props.text}
    </a>
  );
};

export type { ButtonMoreProps };
export { ButtonMore };
