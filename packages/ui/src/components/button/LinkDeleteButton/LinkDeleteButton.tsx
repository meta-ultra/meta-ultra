import { RiDeleteBin5Fill, RiDeleteBin5Line } from "react-icons/ri";
import LinkButton from "../LinkButton/LinkButton";
import useEvent from "react-use-event-hook";
import "./LinkDeleteButton.css";

interface LinkDeleteButtonProps<S> {
  state?: S;
  text: string;
  onClick: (option: { state?: S }) => void;
}

const LinkDeleteButton = <S,>(props: LinkDeleteButtonProps<S>) => {
  const handleClick = useEvent(() => {
    props.onClick({ state: props.state });
  });

  return (
    <LinkButton
      icon={<RiDeleteBin5Line />}
      hoverIcon={<RiDeleteBin5Fill />}
      className="mu-link-delete-button"
      onClick={handleClick}
    >
      {props.text}
    </LinkButton>
  );
};

export type { LinkDeleteButtonProps };
export default LinkDeleteButton;
