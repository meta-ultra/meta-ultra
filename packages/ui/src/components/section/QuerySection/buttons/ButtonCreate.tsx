import type { FC } from "react";
import { Button } from "antd";
import { GrAdd } from "react-icons/gr";
import useEvent from "react-use-event-hook";
import { QueryButtonProps, QueryButtonStatus } from "./types";
import { useQuerySectionContext } from "../useQuerySectionContext";

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
        icon={<GrAdd size={16} className="relative top-[3px] mr-[5px]" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="!hidden sm:!block"
      >
        <span>{props.text}</span>
      </Button>
      <Button
        shape="circle"
        type="dashed"
        icon={<GrAdd size={16} className="relative top-[3px]" />}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="sm:!hidden"
      />
    </div>
  );
};
export type { ButtonSearchProps };
export { ButtonCreate };
