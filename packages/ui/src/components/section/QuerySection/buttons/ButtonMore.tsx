import type { FC } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import classNames from "classnames";
import useEvent from "react-use-event-hook";
import { QueryButtonProps } from "./types";
import { useQuerySectionContext } from "../useQuerySectionContext";

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
      className={classNames(" text-sm inline-block h-fit select-none", props.className)}
      style={props.style}
      onClick={handleClick}
    >
      <IoChevronDownOutline
        className={classNames("relative inline-block md:order-1 -top-[2px]", {
          "rotate-180": props.expand,
        })}
      />
      {props.text}
    </a>
  );
};

export type { ButtonMoreProps };
export { ButtonMore };
