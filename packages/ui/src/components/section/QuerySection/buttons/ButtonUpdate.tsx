import type { FC } from "react";
import { Button } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import useEvent from "react-use-event-hook";
import { QueryButtonProps, QueryButtonStatus } from "./types";
import { useQuerySectionContext } from "../useQuerySectionContext";

interface ButtonUpdateProps extends QueryButtonProps {
  text?: string;
}

const ButtonUpdate: FC<ButtonUpdateProps> = (props) => {
  const { form } = useQuerySectionContext();
  const handleClick = useEvent(() => {
    props.onClick({ form });
  });

  return (
    <div className={props.className} style={props.style}>
      <Button
        icon={<AiOutlineEdit size={16} className="relative top-[3px] mr-[5px]" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="!hidden sm:!block"
      >
        <span>{props.text}</span>
      </Button>
      <Button
        shape="circle"
        icon={<AiOutlineEdit size={16} className="relative top-[3px]" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="sm:!hidden"
      />
    </div>
  );
};

export type { ButtonUpdateProps };
export { ButtonUpdate };
