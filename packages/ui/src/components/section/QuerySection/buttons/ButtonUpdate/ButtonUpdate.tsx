import type { FC } from "react";
import { Button } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import useEvent from "react-use-event-hook";
import { QueryButtonProps, QueryButtonStatus } from "../types";
import { useQuerySectionContext } from "../../useQuerySectionContext";
import "./ButtonUpdate.css";

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
        icon={<AiOutlineEdit size={16} className="mu-button-update__icon" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="mu-button-update"
      >
        <span>{props.text}</span>
      </Button>
      <Button
        shape="circle"
        icon={
          <AiOutlineEdit
            size={16}
            className="mu-button-update--compact__icon"
          />
        }
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="mu-button-update--compact"
      />
    </div>
  );
};

export type { ButtonUpdateProps };
export { ButtonUpdate };
