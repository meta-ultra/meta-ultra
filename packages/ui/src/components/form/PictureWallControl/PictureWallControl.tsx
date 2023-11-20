import { FC } from "react";
import PictureWall, { type PictureWallProps } from "../../upload/PictureWall/PictureWall";
import useEvent from "react-use-event-hook";

type PictureWallControlProps = Omit<PictureWallProps, "fileList"> & {
  value?: PictureWallProps["fileList"];
  onChange?: (fileList: PictureWallProps["fileList"]) => void;
};

const PictureWallControl: FC<PictureWallControlProps> = ({ value, onChange, ...rest }) => {
  const handleChange = useEvent(({ fileList }) => onChange && onChange(fileList));

  return <PictureWall {...rest} fileList={value} onChange={handleChange} />;
};

export type { PictureWallControlProps };
export default PictureWallControl;
