import { FormInstance } from "antd";
import { CSSProperties } from "react";

interface QueryButtonProps {
  status?: QueryButtonStatus;
  onClick: (evt: { form?: FormInstance }) => void;
  className?: string;
  style?: CSSProperties;
}

enum QueryButtonStatus {
  ENABLE = 0,
  DISABLE = 1,
}

export type { QueryButtonProps };
export { QueryButtonStatus };
