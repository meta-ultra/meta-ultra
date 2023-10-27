import { FC } from "react";
import PictureWall, { type PictureWallProps } from "../../upload/PictureWall/PictureWall";

type PictureWallControlProps = Omit<PictureWallProps, "fileList"> & {
  value?: PictureWallProps["fileList"];
};

const PictureWallControl: FC<PictureWallControlProps> = ({ value, ...rest }) => {
  return <PictureWall {...rest} fileList={value} />;
};

export type { PictureWallControlProps };
export default PictureWallControl;
