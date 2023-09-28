import type { FC } from "react";
import { Button } from "antd";
import { GrAdd } from "react-icons/gr";
import useEvent from "react-use-event-hook";
import { QueryButtonProps, QueryButtonStatus } from "../types";
import { useQuerySectionContext } from "../../useQuerySectionContext";
import "./ButtonCreate.css";

interface ButtonSearchProps extends QueryButtonProps {
  text?: string;
}
const ButtonCreate: FC<ButtonSearchProps> = (props) => {
  const { form } = useQuerySectionContext();
  const handleClick = useEvent(() => {
    props.onClick({ form });
  });

  return (
    <div className={props.className} style={props.style}>
      <Button
        type="dashed"
        icon={<GrAdd size={16} className="mu-button-create__icon" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="mu-button-create"
      >
        <span>{props.text}</span>
      </Button>
      <Button
        shape="circle"
        type="dashed"
        icon={<GrAdd size={16} className="mu-button-create--compact__icon" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="mu-button-create--compact"
      />
    </div>
  );
};
export type { ButtonSearchProps };
export { ButtonCreate };
