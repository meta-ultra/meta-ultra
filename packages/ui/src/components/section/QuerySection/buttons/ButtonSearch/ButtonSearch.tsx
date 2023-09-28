import { FC, createElement } from "react";
import { Button } from "antd";
import { HiOutlineRefresh } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import useEvent from "react-use-event-hook";
import { QueryButtonProps, QueryButtonStatus } from "../types";
import { useQuerySectionContext } from "../../useQuerySectionContext";
import "./ButtonSearch.css";

interface ButtonSearchProps extends QueryButtonProps {
  refreshText?: string;
  searchText?: string;
}

const ButtonSearch: FC<ButtonSearchProps> = (props) => {
  const { form, formItemCount } = useQuerySectionContext();
  const handleClick = useEvent(() => {
    props.onClick({ form });
  });

  return (
    <div className={props.className} style={props.style}>
      <Button
        type="primary"
        icon={createElement(formItemCount == 0 ? HiOutlineRefresh : FiSearch, {
          className: "mu-button-search__icon",
        })}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="mu-button-search"
      >
        <span>{formItemCount == 0 ? props.refreshText : props.searchText}</span>
      </Button>
      <Button
        shape="circle"
        type="primary"
        icon={createElement(formItemCount == 0 ? HiOutlineRefresh : FiSearch, {
          className: "mu-button-search--compact__icon",
        })}
        disabled={props.status == QueryButtonStatus.DISABLE}
        onClick={handleClick}
        className="mu-button-search--compact"
      />
    </div>
  );
};

export { ButtonSearch };
