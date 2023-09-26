import { AiOutlineEdit, AiFillEdit } from "react-icons/ai";
import LinkButton from "../LinkButton/LinkButton";
import useEvent from "react-use-event-hook";

interface LinkUpdateButtonProps<S> {
  state?: S;
  text: string;
  onClick: (option: { state?: S }) => void;
}

const LinkUpdateButton = <S,>(props: LinkUpdateButtonProps<S>) => {
  const handleClick = useEvent(() => {
    props.onClick({ state: props.state });
  });

  return (
    <LinkButton
      icon={<AiOutlineEdit />}
      hoverIcon={<AiFillEdit />}
      onClick={handleClick}
    >
      {props.text}
    </LinkButton>
  );
};

export default LinkUpdateButton;
