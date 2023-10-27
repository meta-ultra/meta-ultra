import { FC } from "react";
import { Switch, type SwitchProps } from "antd";

type SwitchControlProps = Omit<SwitchProps, "checked"> & {
  value?: SwitchProps["checked"];
};

const SwitchControl: FC<SwitchControlProps> = ({ value, ...rest }) => {
  return <Switch {...rest} checked={value} />;
};

export type { SwitchControlProps };
export default SwitchControl;
